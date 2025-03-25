import multer from 'multer';
import * as chatUpload from '../../../middleware/chatMulterConfig.js'; // Adjust import path

jest.mock('multer');

describe('Chat Upload Configuration', () => {
  let mockMulterInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    multer.memoryStorage = jest.fn().mockImplementation(() => 'mockMemoryStorage');
    
    mockMulterInstance = {
      single: jest.fn(),
      array: jest.fn(),
      fields: jest.fn(),
      none: jest.fn(),
      any: jest.fn()
    };
    
    multer.mockReturnValue(mockMulterInstance);
  });


  // File filter tests
  describe('File Filter', () => {
    // Get the actual fileFilter function
    const { fileFilter } = chatUpload;

    it('should accept image files', () => {
      const cb = jest.fn();
      const imageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      
      imageTypes.forEach(mimetype => {
        fileFilter(null, { mimetype }, cb);
        expect(cb).toHaveBeenCalledWith(null, true);
        cb.mockClear();
      });
    });

    it('should accept document files', () => {
      const cb = jest.fn();
      const docTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      docTypes.forEach(mimetype => {
        fileFilter(null, { mimetype }, cb);
        expect(cb).toHaveBeenCalledWith(null, true);
        cb.mockClear();
      });
    });

    it('should reject unsupported file types', () => {
      const cb = jest.fn();
      const invalidTypes = [
        'image/gif',
        'text/plain',
        'application/zip',
        'video/mp4'
      ];
      
      invalidTypes.forEach(mimetype => {
        fileFilter(null, { mimetype }, cb);
        expect(cb).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Only JPG, JPEG, PNG, PDF, and DOC/DOCX files are allowed!'
          }),
          false
        );
        cb.mockClear();
      });
    });

    it('should return error with correct message', () => {
      const cb = jest.fn();
      fileFilter(null, { mimetype: 'application/zip' }, cb);
      
      expect(cb.mock.calls[0][0].message)
        .toBe('Only JPG, JPEG, PNG, PDF, and DOC/DOCX files are allowed!');
    });
  });
});