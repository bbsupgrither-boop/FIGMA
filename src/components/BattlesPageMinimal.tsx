export function BattlesPageMinimal() {
  const handleClick = () => {
    console.log('MINIMAL BUTTON CLICKED!');
    alert('Минимальная кнопка работает!');
  };

  return (
    <div style={{ 
      padding: '20px', 
      minHeight: '100vh',
      background: 'white',
      color: 'black',
      position: 'relative',
      zIndex: 1000
    }}>
      <h1>Минимальная страница баттлов</h1>
      
      <button 
        onClick={handleClick}
        style={{
          padding: '10px 20px',
          margin: '10px',
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        ТЕСТ КНОПКА 1
      </button>

      <button 
        onClick={() => {
          console.log('INLINE BUTTON CLICKED!');
          alert('Инлайн кнопка работает!');
        }}
        style={{
          padding: '10px 20px',
          margin: '10px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        ТЕСТ КНОПКА 2 (INLINE)
      </button>

      <div style={{
        padding: '20px',
        border: '2px solid green',
        margin: '20px 0'
      }}>
        <h3>Тестовая карточка "баттла"</h3>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            onClick={(e) => {
              console.log('VICTORY BUTTON EVENT:', e);
              console.log('Target:', e.target);
              console.log('Current target:', e.currentTarget);
              alert('Кнопка победы работает!');
            }}
            style={{
              flex: 1,
              padding: '8px 16px',
              backgroundColor: 'green',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Выиграл
          </button>
          <button
            onClick={(e) => {
              console.log('CANCEL BUTTON EVENT:', e);
              console.log('Target:', e.target);
              console.log('Current target:', e.currentTarget);
              alert('Кнопка отмены работает!');
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: 'orange',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Отменить
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px' }}>
        <p>Инструкции:</p>
        <p>1. Откройте консоль браузера (F12)</p>
        <p>2. Нажмите на любую кнопку</p>
        <p>3. Проверьте, появляются ли логи в консоли</p>
        <p>4. Проверьте, появляются ли alert уведомления</p>
      </div>
    </div>
  );
}