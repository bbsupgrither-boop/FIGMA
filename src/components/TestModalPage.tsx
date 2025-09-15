import { useState } from 'react';
import { Modal } from './Modal';
import { ModalOpaque } from './ModalOpaque';

interface TestModalPageProps {
  theme: 'light' | 'dark';
}

export function TestModalPage({ theme }: TestModalPageProps) {
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [isModal3Open, setIsModal3Open] = useState(false);

  return (
    <div className="min-h-screen p-8 space-y-4">
      <h1 className="text-2xl font-semibold mb-6">Тест модальных окон</h1>
      <p className="text-muted-foreground mb-6">
        Все модальные окна теперь можно закрыть нажатием на область вне модала или клавишей Escape
      </p>

      <button
        onClick={() => setIsModal1Open(true)}
        className="block w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-pressed transition-colors mb-4"
      >
        Открыть обычный модал
      </button>

      <button
        onClick={() => setIsModal2Open(true)}
        className="block w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-pressed transition-colors mb-4"
      >
        Открыть непрозрачный модал
      </button>

      <button
        onClick={() => setIsModal3Open(true)}
        className="block w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-pressed transition-colors mb-4"
      >
        Открыть модал без кнопки закрытия
      </button>

      {/* Обычный модал */}
      <Modal
        isOpen={isModal1Open}
        onClose={() => setIsModal1Open(false)}
        title="Обычный модал"
        theme={theme}
      >
        <div className="space-y-4">
          <p>Этот модал можно закрыть:</p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Нажав на затемненную область вне модала</li>
            <li>Нажав клавишу Escape</li>
            <li>Нажав кнопку "Закрыть" ниже</li>
          </ul>
          <button
            onClick={() => setIsModal1Open(false)}
            className="w-full px-4 py-2 bg-surface-2 text-foreground rounded-lg hover:bg-surface-3 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </Modal>

      {/* Непрозрачный модал */}
      <ModalOpaque
        isOpen={isModal2Open}
        onClose={() => setIsModal2Open(false)}
        title="Непрозрачный модал"
        theme={theme}
        actions={
          <button
            onClick={() => setIsModal2Open(false)}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-pressed transition-colors"
          >
            Готово
          </button>
        }
      >
        <div className="space-y-4">
          <p>Этот непрозрачный модал также можно закрыть:</p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Нажав на область вне модала</li>
            <li>Нажав клавишу Escape</li>
            <li>Нажав кнопку "Готово"</li>
          </ul>
        </div>
      </ModalOpaque>

      {/* Модал без функции закрытия (чтобы показать, что он все равно не закроется) */}
      <Modal
        isOpen={isModal3Open}
        title="Модал без кнопки закрытия"
        theme={theme}
      >
        <div className="space-y-4">
          <p>Этот модал НЕ МОЖЕТ быть закрыт по клику снаружи, потому что не передана функция onClose.</p>
          <p className="text-sm text-muted-foreground">
            Это демонстрирует, что модалы могут блокировать закрытие когда это необходимо.
          </p>
          <button
            onClick={() => setIsModal3Open(false)}
            className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Принудительно закрыть
          </button>
        </div>
      </Modal>
    </div>
  );
}