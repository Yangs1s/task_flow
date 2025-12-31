// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import {TextEncoder, TextDecoder} from 'util'
import crypto from 'crypto';

// Mock Supabase module
jest.mock('@/src/shared/lib/supabase');

Object.assign(global, {TextEncoder, TextDecoder})

if(typeof global.crypto !== 'undefined'){
    Object.defineProperty(global,'crypto',{
        value:{
            randomUUID: ()=> crypto.randomUUID(),
        }
    })
} else if (typeof global.crypto.randomUUID === 'undefined') {
    // global.crypto는 있는데 randomUUID만 없는 경우 (일부 jsdom 버전)
    Object.defineProperty(global.crypto, 'randomUUID', {
      value: () => crypto.randomUUID(),
      writable: true,
    });
}