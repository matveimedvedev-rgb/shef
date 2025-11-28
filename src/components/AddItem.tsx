import { useState, useRef, useEffect } from 'react';
import { InventoryItem, Tab } from '../types';
import { recognizeImageFromFile, processSpeechInput } from '../services/openai';

interface AddItemProps {
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onNavigate: (tab: Tab) => void;
}

type InputMode = 'text' | 'image' | 'speech';

export default function AddItem({ onAddItem, onNavigate }: AddItemProps) {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    expires: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionText, setRecognitionText] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Clear error when switching modes
  useEffect(() => {
    setError(null);
  }, [inputMode]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a name');
      return;
    }
    onAddItem({
      name: formData.name,
      quantity: formData.quantity,
      expires: formData.expires || undefined,
    });
    // Reset form and navigate to inventory
    setFormData({ name: '', quantity: '', expires: '' });
    onNavigate('inventory');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 20MB for OpenAI)
    if (file.size > 20 * 1024 * 1024) {
      setError('Image is too large. Please use an image smaller than 20MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Use OpenAI for image recognition
    setIsProcessingImage(true);
    setError(null);
    try {
      console.log('Starting image recognition for file:', file.name, file.type, file.size);
      const recognized = await recognizeImageFromFile(file);
      console.log('Recognition result:', recognized);
      setFormData({
        name: recognized.name,
        quantity: recognized.quantity,
        expires: recognized.expires || '',
      });
    } catch (err: any) {
      console.error('Image recognition error details:', {
        message: err.message,
        error: err,
        stack: err.stack,
      });
      setError(err.message || 'Failed to recognize image. Please check the browser console for details.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleImageSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please wait for image recognition to complete');
      return;
    }
    onAddItem({
      name: formData.name,
      quantity: formData.quantity,
      expires: formData.expires || undefined,
    });
    setFormData({ name: '', quantity: '', expires: '' });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onNavigate('inventory');
  };

  const startSpeechRecognition = async () => {
    setError(null);
    setIsRecognizing(true);
    setRecognitionText('');
    audioChunksRef.current = [];

    try {
      // Get user media for audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          try {
            // Process with OpenAI
            const recognized = await processSpeechInput(audioBlob);
            setFormData({
              name: recognized.name,
              quantity: recognized.quantity,
              expires: recognized.expires || '',
            });
            setRecognitionText('Audio processed successfully');
          } catch (err: any) {
            setError(err.message || 'Failed to process speech');
            console.error('Speech processing error:', err);
          }
        }
        
        setIsRecognizing(false);
      };

      mediaRecorder.start();
      setRecognitionText('Listening...');
    } catch (error: any) {
      console.error('Error starting recording:', error);
      setError('Failed to access microphone. Please check permissions.');
      setIsRecognizing(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecognizing(false);
  };

  const handleSpeechSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please speak to add an item');
      return;
    }
    onAddItem({
      name: formData.name,
      quantity: formData.quantity,
      expires: formData.expires || undefined,
    });
    setFormData({ name: '', quantity: '', expires: '' });
    setRecognitionText('');
    onNavigate('inventory');
  };

  return (
    <div className="page-transition">
      <div className="mb-10">
        <h1 className="text-[36px] font-bold text-text mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Add to Your Kitchen
        </h1>
        <p className="text-lg text-text-secondary">Track what you buy. Stop the food waste cycle.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl border border-neutral/20">
        {/* Mode selector */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setInputMode('text')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ease-out active:scale-95 shadow-md hover:shadow-lg ${
              inputMode === 'text'
                ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg scale-105'
                : 'bg-neutral text-text-secondary hover:bg-neutral/80'
            }`}
          >
            ✏️ Text
          </button>
          <button
            onClick={() => setInputMode('image')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ease-out active:scale-95 shadow-md hover:shadow-lg ${
              inputMode === 'image'
                ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg scale-105'
                : 'bg-neutral text-text-secondary hover:bg-neutral/80'
            }`}
          >
            📷 Image
          </button>
          <button
            onClick={() => setInputMode('speech')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ease-out active:scale-95 shadow-md hover:shadow-lg ${
              inputMode === 'speech'
                ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg scale-105'
                : 'bg-neutral text-text-secondary hover:bg-neutral/80'
            }`}
          >
            🎤 Speech
          </button>
        </div>

        {/* Text input mode */}
        {inputMode === 'text' && (
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none text-text"
                placeholder="e.g., Milk"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Quantity</label>
              <input
                type="text"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-neutral px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none text-text"
                placeholder="e.g., 1 carton"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Expiration date
              </label>
              <input
                type="date"
                value={formData.expires}
                onChange={(e) => setFormData({ ...formData, expires: e.target.value })}
                className="w-full bg-neutral px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none text-text"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 ease-out active:scale-95 hover:scale-105"
            >
              Save Item ✨
            </button>
          </form>
        )}

        {/* Image input mode */}
        {inputMode === 'image' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Upload image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingImage}
                className="w-full bg-gradient-to-r from-accent/20 to-accent/10 px-4 py-4 rounded-xl text-text font-semibold hover:from-accent/30 hover:to-accent/20 transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg border-2 border-accent/30"
              >
                📷 Choose Image
              </button>
            </div>

            {error && inputMode === 'image' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {isProcessingImage && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-text-secondary mt-2">Analyzing image with AI...</p>
              </div>
            )}

            {imagePreview && (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full rounded-lg object-cover max-h-48"
                  />
                </div>
                {!isProcessingImage && formData.name && (
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-sm text-text-secondary mb-2">Recognized:</p>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-text-secondary mb-1">Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none text-text"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-secondary mb-1">Quantity</label>
                        <input
                          type="text"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="w-full bg-white px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none text-text"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-secondary mb-1">
                          Expiration date
                        </label>
                        <input
                          type="date"
                          value={formData.expires}
                          onChange={(e) => setFormData({ ...formData, expires: e.target.value })}
                          className="w-full bg-white px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none text-text"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleImageSubmit}
                  disabled={!formData.name.trim() || isProcessingImage}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 ease-out active:scale-95 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Save Item ✨
                </button>
              </div>
            )}
          </div>
        )}

        {/* Speech input mode */}
        {inputMode === 'speech' && (
          <div className="space-y-4">
            <div className="text-center">
              {!isRecognizing ? (
                <button
                  onClick={startSpeechRecognition}
                  className="w-full bg-gradient-to-r from-accent to-accent/80 text-white px-6 py-5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 ease-out active:scale-95 hover:scale-105 flex items-center justify-center gap-3"
                >
                  <span className="text-3xl">🎤</span>
                  <span>Start Speaking</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={stopSpeechRecognition}
                    className="w-full bg-gradient-to-r from-red-500 to-red-400 text-white px-6 py-5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 ease-out active:scale-95 hover:scale-105 flex items-center justify-center gap-3 pulse-glow"
                  >
                    <span className="text-3xl animate-pulse">🔴</span>
                    <span>Listening... Click to Stop</span>
                  </button>
                  <p className="text-sm text-text-secondary">
                    Say something like: "We bought 2 cartons of milk" or "I have 12 eggs expiring soon"
                  </p>
                </div>
              )}
            </div>

            {error && inputMode === 'speech' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {recognitionText && (
              <div className="bg-primary/10 rounded-lg p-3">
                <p className="text-sm text-text-secondary mb-2">Status:</p>
                <p className="text-text font-medium">{recognitionText}</p>
              </div>
            )}

            {formData.name && (
              <div className="bg-primary/10 rounded-lg p-3 space-y-2">
                <p className="text-sm text-text-secondary mb-2">Parsed:</p>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none text-text"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Quantity</label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-white px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none text-text"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">
                    Expiration date
                  </label>
                  <input
                    type="date"
                    value={formData.expires}
                    onChange={(e) => setFormData({ ...formData, expires: e.target.value })}
                    className="w-full bg-white px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none text-text"
                  />
                </div>
                <button
                  onClick={handleSpeechSubmit}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 ease-out active:scale-95 hover:scale-105 mt-2"
                >
                  Save Item ✨
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

