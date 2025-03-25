import * as upload from "../../../middleware/multerConfig.js"

import multer from 'multer';

jest.mock('multer');

describe('Multer Configuration', () => {
  let mockFileFilter;
  let mockMulterInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockFileFilter = jest.fn();
    
    mockMulterInstance = {
      single: jest.fn(),
      array: jest.fn(),
      fields: jest.fn(),
      none: jest.fn(),
      any: jest.fn()
    };
    
    multer.mockReturnValue(mockMulterInstance);
    
    multer.memoryStorage = jest.fn();
  });

  describe('File Filter', () => {
    // Get the actual fileFilter function from your implementation
    const { fileFilter } = upload;

    it('should accept JPEG images', () => {
      const cb = jest.fn();
      fileFilter(null, { mimetype: 'image/jpeg' }, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('should accept PNG images', () => {
      const cb = jest.fn();
      fileFilter(null, { mimetype: 'image/png' }, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('should accept JPG images', () => {
      const cb = jest.fn();
      fileFilter(null, { mimetype: 'image/jpg' }, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('should reject GIF images', () => {
      const cb = jest.fn();
      fileFilter(null, { mimetype: 'image/gif' }, cb);
      expect(cb).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Only JPG, JPEG, and PNG images are allowed!'
        }),
        false
      );
    });

    it('should reject PDF files', () => {
      const cb = jest.fn();
      fileFilter(null, { mimetype: 'application/pdf' }, cb);
      expect(cb).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Only JPG, JPEG, and PNG images are allowed!'
        }),
        false
      );
    });
  });
});