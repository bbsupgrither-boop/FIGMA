import { useState, useRef } from 'react';
import { ModalOpaque } from './ModalOpaque';
import { X, Upload, User, Paperclip, FileText } from 'lucide-react';
import { Battle } from '../types/battles';

interface BattleCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  battle: Battle;
  onSubmitEvidence: (battleId: string, comment: string, files: File[]) => void;
  theme?: 'light' | 'dark';
}

export function BattleCompleteModal({ 
  isOpen, 
  onClose, 
  battle,
  onSubmitEvidence,
  theme = 'light' 
}: BattleCompleteModalProps) {
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isSubmitDisabled = files.length === 0 || comment.trim().length === 0;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles.slice(0, 2 - prev.length)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!isSubmitDisabled) {
      onSubmitEvidence(battle.id, comment.trim(), files);
      setComment('');
      setFiles([]);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <ModalOpaque
      isOpen={isOpen}
      onClose={onClose}
      title="Завершение баттла"
      theme={theme}
      actions={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl transition-all hover:opacity-80"
            style={{
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#F3F5F8',
              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E6E9EF',
              color: theme === 'dark' ? '#E8ECF2' : '#6B7280'
            }}
          >
            <span className="unified-button">Отменить</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="flex-1 py-3 px-4 rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              background: isSubmitDisabled ? 
                (theme === 'dark' ? '#6B7280' : '#9CA3AF') : 
                '#2B82FF',
              border: isSubmitDisabled ? 
                (theme === 'dark' ? '1px solid #6B7280' : '1px solid #9CA3AF') : 
                '1px solid #2B82FF',
              color: '#FFFFFF',
              cursor: isSubmitDisabled ? 'not-allowed' : 'pointer'
            }}
          >
            <span className="unified-button">Отправить</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Информация о баттле */}
        <div 
          className="p-4 rounded-xl border"
          style={{
            background: theme === 'dark' ? '#1C2029' : '#F9FAFB',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span 
              className="text-xs"
              style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
            >
              Участники баттла
            </span>
            <span 
              className="text-xs px-2 py-1 rounded-full"
              style={{
                background: theme === 'dark' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 215, 0, 0.1)',
                color: theme === 'dark' ? '#FFD700' : '#FFA500'
              }}
            >
              Ставка: {battle.stake} монет
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: theme === 'dark' ? 'rgba(43, 130, 255, 0.2)' : 'rgba(43, 130, 255, 0.1)',
                }}
              >
                <User style={{ width: '12px', height: '12px', color: '#2B82FF' }} />
              </div>
              <span 
                className="text-xs font-medium"
                style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
              >
                {battle.challengerName}
              </span>
            </div>
            
            <span 
              className="text-xs"
              style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
            >
              VS
            </span>
            
            <div className="flex items-center gap-2">
              <span 
                className="text-xs font-medium"
                style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
              >
                {battle.opponentName}
              </span>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: theme === 'dark' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 59, 48, 0.1)',
                }}
              >
                <User style={{ width: '12px', height: '12px', color: '#FF3B30' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Загрузка файлов */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label 
              className="unified-text font-medium"
              style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
            >
              Доказательства победы
            </label>
            <span 
              className="text-xs"
              style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
            >
              {files.length}/2 файла
            </span>
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= 2}
            className="w-full p-4 rounded-xl border-2 border-dashed transition-all hover:opacity-80 disabled:opacity-50"
            style={{
              background: theme === 'dark' ? 'rgba(43, 130, 255, 0.05)' : 'rgba(43, 130, 255, 0.02)',
              borderColor: theme === 'dark' ? 'rgba(43, 130, 255, 0.3)' : 'rgba(43, 130, 255, 0.2)',
              color: theme === 'dark' ? '#2B82FF' : '#2B82FF'
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <Paperclip style={{ width: '20px', height: '20px' }} />
              <span className="text-xs">
                {files.length < 2 ? 'Прикрепить файл' : 'Максимум 2 файла'}
              </span>
              <span 
                className="text-xs"
                style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
              >
                Скриншоты отчетов обоих участников
              </span>
            </div>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Список загруженных файлов */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                  style={{
                    background: theme === 'dark' ? '#1C2029' : '#F9FAFB',
                    border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
                  }}
                >
                  <FileText 
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      color: theme === 'dark' ? '#2B82FF' : '#2B82FF' 
                    }} 
                  />
                  <div className="flex-1 min-w-0">
                    <div 
                      className="text-xs font-medium truncate"
                      style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                    >
                      {file.name}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                    >
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all"
                    style={{
                      background: theme === 'dark' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 59, 48, 0.1)',
                      color: theme === 'dark' ? '#FF453A' : '#FF3B30'
                    }}
                  >
                    <X style={{ width: '12px', height: '12px' }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Комментарий */}
        <div className="space-y-2">
          <label 
            className="unified-text font-medium"
            style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
          >
            Комментарий
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Опишите результаты баттла и приложите доказательства..."
            rows={4}
            className="w-full p-3 rounded-xl border resize-none"
            style={{
              background: theme === 'dark' ? '#1C2029' : '#FFFFFF',
              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
            }}
          />
          <p 
            className="text-xs"
            style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
          >
            Администратор проверит доказательства и определит победителя
          </p>
        </div>
      </div>
    </ModalOpaque>
  );
}