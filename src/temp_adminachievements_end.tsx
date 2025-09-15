/* Модальное окно награды */
      <Dialog open={rewardModalOpen} onOpenChange={setRewardModalOpen}>
        <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden rounded-3xl">
          <DialogTitle className="text-lg font-medium text-foreground text-center">Настройка награды</DialogTitle>
          <DialogDescription className="sr-only">
            Модальное окно для настройки типа и размера награды за достижение
          </DialogDescription>
          <div className="p-6 pt-2">
            <div className="space-y-6">
              {/* Тип награды */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-foreground text-center">
                  Тип награды
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRewardType('XP')}
                    className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all ${ 
                      rewardType === 'XP' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'glass-card text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    XP
                  </button>
                  <button
                    onClick={() => setRewardType('G-coin')}
                    className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all ${
                      rewardType === 'G-coin'
                        ? 'bg-primary text-primary-foreground'
                        : 'glass-card text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    G-coin
                  </button>
                </div>
              </div>

              {/* Количество */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-foreground text-center">
                  Количество
                </div>
                <div className="glass-card rounded-lg p-3">
                  {isEditingAmount ? (
                    <Input
                      type="number"
                      value={rewardAmount}
                      onChange={(e) => setRewardAmount(e.target.value)}
                      onBlur={() => setIsEditingAmount(false)}
                      className="bg-transparent border-none text-center text-lg font-medium p-0 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => setIsEditingAmount(true)}
                      className="w-full text-lg font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded p-2 transition-colors"
                    >
                      {rewardAmount}
                    </button>
                  )}
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setRewardModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-secondary text-foreground rounded-full text-sm font-medium transition-colors hover:bg-accent"
                >
                  Отменить
                </button>
                <button
                  onClick={handleRewardSave}
                  className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-colors hover:bg-primary/90"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно отклонения */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden rounded-3xl">
          <DialogTitle className="text-lg font-medium text-foreground text-center">Отклонить достижение</DialogTitle>
          <DialogDescription className="sr-only">
            Модальное окно для отклонения достижения с указанием причины и комментария
          </DialogDescription>
          <div className="p-6 pt-2">
            <div className="space-y-6">
              {/* Причина отклонения */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-foreground">
                  Причина отклонения *
                </div>
                <Input
                  placeholder="Укажите причину отклонения"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="bg-transparent border border-border rounded-lg"
                />
              </div>

              {/* Комментарий */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-foreground">
                  Комментарий (необязательно)
                </div>
                <Textarea
                  placeholder="Дополнительные комментарии..."
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  className="bg-transparent border border-border rounded-lg resize-none min-h-20"
                />
              </div>

              {/* Файл */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-foreground">
                  Прикрепить файл (необязательно)
                </div>
                <div className="glass-card rounded-lg p-4 text-center">
                  <input
                    type="file"
                    id="reject-file-upload"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="reject-file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Paperclip className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {rejectFile ? rejectFile.name : 'Выбрать файл'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-secondary text-foreground rounded-full text-sm font-medium transition-colors hover:bg-accent"
                >
                  Отменить
                </button>
                <button
                  onClick={handleSubmitReject}
                  className="flex-1 py-3 px-4 bg-destructive text-destructive-foreground rounded-full text-sm font-medium transition-colors hover:bg-destructive/90"
                >
                  Отклонить
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}