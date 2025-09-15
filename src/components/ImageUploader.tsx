import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  defaultEmoji?: string;
  className?: string;
  acceptEmojiOnly?: boolean;
}

export function ImageUploader({ 
  value, 
  onChange, 
  placeholder = 'Введите URL изображения или загрузите файл',
  defaultEmoji = '📷',
  className = '',
  acceptEmojiOnly = false
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Функция для проверки, является ли строка URL или base64
  const isImageUrl = (str: string) => {
    try {
      new URL(str);
      return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:');
    } catch {
      return false;
    }
  };

  // Функция для конвертации файла в base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Обработка загрузки файла
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите файл изображения');
        return;
      }
      
      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Размер файла не должен превышать 5MB');
        return;
      }

      try {
        const base64 = await convertFileToBase64(file);
        onChange(base64);
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        alert('Ошибка при загрузке файла');
      }
    }
  };

  // Функция для очистки изображения
  const clearImage = () => {
    onChange(defaultEmoji);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Компонент для отображения изображения или эмодзи
  const ImageDisplay = ({ src, className = '', style = {} }: { src: string; className?: string; style?: React.CSSProperties }) => {
    if (isImageUrl(src)) {
      return (
        <ImageWithFallback
          src={src}
          alt="Uploaded image"
          className={`${className} object-cover`}
          style={style}
        />
      );
    }
    return (
      <div className={`flex items-center justify-center ${className}`} style={style}>
        <span className="text-xl">{src}</span>
      </div>
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Кнопки для выбора способа добавления изображения */}
      {!acceptEmojiOnly && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Загрузить файл
          </button>
          <button
            type="button"
            onClick={() => {
              const emoji = prompt('Введите эмодзи:', defaultEmoji);
              if (emoji) {
                onChange(emoji);
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-surface-2 text-foreground border border-border rounded-lg hover:bg-surface-3 transition-colors"
          >
            <span className="text-lg">😀</span>
            Эмодзи
          </button>
        </div>
      )}

      {/* Скрытый файловый инпут */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Поле для URL/текста */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-input-background border border-border rounded-lg"
        placeholder={placeholder}
      />
      
      <div className="text-xs text-muted-foreground">
        {acceptEmojiOnly 
          ? 'Используйте эмодзи или введите текст'
          : 'Можно загрузить файл, использовать эмодзи или вставить URL/base64 изображения'
        }
      </div>

      {/* Предварительный просмотр */}
      {value && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Предпросмотр:</span>
          <div className="w-12 h-12 rounded border overflow-hidden relative bg-surface-2">
            <ImageDisplay
              src={value}
              className="w-full h-full"
            />
            {/* Кнопка очистки для загруженных изображений */}
            {isImageUrl(value) && (
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          {isImageUrl(value) && (
            <div className="text-xs text-muted-foreground">
              {value.startsWith('data:') ? 'Загруженный файл' : 'URL изображение'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}