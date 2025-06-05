import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Emoji mapping for encryption
const EMOJI_MAP = [
  "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
  "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
  "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
  "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
  "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧",
  "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓", "🧐",
  "😕", "😟", "🙁", "😮", "😯", "😲", "😳", "🥺", "😦", "😧",
  "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓",
  "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀",
  "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸",
  "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙈", "🙉", "🙊",
  "💋", "💌", "💘", "💝", "💖", "💗", "💓", "💞", "💕", "💟",
  "❣️", "💔", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤",
  "🤍", "💯", "💢", "💥", "💫", "💦", "💨", "🕳️", "💣", "💬",
  "👁️", "🗨️", "🗯️", "💭", "💤", "👋", "🤚", "🖐️", "✋", "🖖",
  "👌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆",
  "🖕", "👇", "☝️", "👍", "👎", "👊", "✊", "🤛", "🤜", "👏",
  "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾",
  "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🦷", "🦴", "👀",
  "👁️", "👅", "👄", "👶", "🧒", "👦", "👧", "🧑", "👱", "👨",
  "🧔", "👩", "🧓", "👴", "👵", "🙍", "🙎", "🙅", "🙆", "💁",
  "🙋", "🧏", "🙇", "🤦", "🤷", "👮", "🕵️", "💂", "👷", "🤴",
  "👸", "👳", "👲", "🧕", "🤵", "👰", "🤰", "🤱", "👼", "🎅",
  "🤶", "🦸", "🦹", "🧙", "🧚", "🧛", "🧜", "🧝", "🧞", "🧟",
  "💆", "💇", "🚶", "🧍", "🧎", "🏃", "💃", "🕺", "🕴️", "👯",
  "🧖", "🧗", "🤺", "🏇", "⛷️", "🏂", "🏌️", "🏄", "🚣", "🏊"
];

function stringToBytes(str: string): number[] {
  return Array.from(new TextEncoder().encode(str));
}

function bytesToString(bytes: number[]): string {
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function simpleHash(password: string): number[] {
  const bytes = stringToBytes(password);
  const hash = new Array(32).fill(0);
  
  for (let i = 0; i < bytes.length; i++) {
    hash[i % 32] ^= bytes[i];
  }
  
  // Simple mixing
  for (let i = 0; i < 32; i++) {
    hash[i] = (hash[i] * 31 + i) % 256;
  }
  
  return hash;
}

function encryptBytes(data: number[], key: number[]): number[] {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    result.push(data[i] ^ key[i % key.length]);
  }
  return result;
}

function decryptBytes(data: number[], key: number[]): number[] {
  return encryptBytes(data, key); // XOR is symmetric
}

export const encryptText = mutation({
  args: {
    text: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.text.trim()) {
      throw new Error("Text cannot be empty");
    }
    
    if (!args.password.trim()) {
      throw new Error("Password cannot be empty");
    }

    try {
      const textBytes = stringToBytes(args.text);
      const key = simpleHash(args.password);
      const encryptedBytes = encryptBytes(textBytes, key);
      
      // Convert to emojis
      const emojis = encryptedBytes.map(byte => EMOJI_MAP[byte % EMOJI_MAP.length]);
      const emojiString = emojis.join("");
      
      return emojiString;
    } catch (error) {
      throw new Error("Encryption failed");
    }
  },
});

export const decryptText = mutation({
  args: {
    emojiText: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.emojiText.trim()) {
      throw new Error("Encrypted text cannot be empty");
    }
    
    if (!args.password.trim()) {
      throw new Error("Password cannot be empty");
    }

    try {
      // Convert emojis back to bytes
      const emojis = Array.from(args.emojiText);
      const bytes = [];
      
      for (const emoji of emojis) {
        const index = EMOJI_MAP.indexOf(emoji);
        if (index === -1) {
          throw new Error("Invalid encrypted text format");
        }
        bytes.push(index);
      }
      
      const key = simpleHash(args.password);
      const decryptedBytes = decryptBytes(bytes, key);
      
      try {
        const decryptedText = bytesToString(decryptedBytes);
        
        // Validate that the decrypted text contains valid UTF-8 characters
        // If the password is wrong, this will likely produce invalid characters
        if (decryptedText.includes('\uFFFD') || decryptedText.length === 0) {
          throw new Error("Invalid password");
        }
        
        return decryptedText;
      } catch (decodeError) {
        throw new Error("Invalid password");
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid password") {
        throw error;
      }
      throw new Error("Decryption failed - invalid encrypted text or password");
    }
  },
});
