import React from 'react';

interface CrystallLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const CrystallLogo: React.FC<CrystallLogoProps> = ({ 
  className = '', 
  size = 18,
  glow = false
}) => {
  return (
    <svg 
      className={className} 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        filter: glow ? 'drop-shadow(0 0 12px var(--accent-glow))' : 'none'
      }}
      viewBox="0 0 415 413" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        fillRule="evenodd" 
        d="M 202 17 L 131 104 L 134 177 L 52 131 L 16 228 L 110 380 L 161 393 L 209 364 L 250 396 L 303 389 L 318 374 L 398 228 L 378 124 L 367 125 L 291 170 L 276 191 L 279 104 L 213 21 Z M 370 242 L 371 244 L 304 367 L 298 373 L 291 376 L 275 378 L 269 377 L 293 328 L 306 296 L 316 278 L 331 263 L 350 254 Z M 41 241 L 50 241 L 92 252 L 99 257 L 150 370 L 149 375 L 122 368 L 117 365 Z M 133 206 L 136 206 L 192 353 L 188 359 L 168 373 L 113 251 L 114 241 Z M 289 204 L 306 263 L 253 375 L 250 377 L 223 354 L 286 204 Z M 54 161 L 56 163 L 61 175 L 63 177 L 85 223 L 87 235 L 78 233 L 70 230 L 52 226 L 44 223 L 38 222 L 34 220 L 34 217 L 45 188 L 45 185 Z M 73 159 L 87 168 L 94 171 L 115 183 L 125 190 L 122 194 L 108 220 L 104 226 L 102 224 L 78 174 L 78 172 L 72 161 Z M 370 155 L 373 163 L 373 168 L 384 217 L 375 223 L 340 242 L 330 245 L 344 212 L 352 196 L 361 173 Z M 351 153 L 352 156 L 316 237 L 314 235 L 308 214 L 306 211 L 302 198 L 302 195 L 299 188 L 299 186 L 300 184 L 306 179 Z M 148 132 L 193 173 L 196 179 L 196 318 L 153 209 L 148 161 Z M 264 130 L 257 234 L 214 335 L 213 178 L 215 174 L 251 139 Z M 216 49 L 260 104 L 214 154 Z M 196 48 L 195 154 L 158 120 L 147 108 Z" 
      />
    </svg>
  );
};
