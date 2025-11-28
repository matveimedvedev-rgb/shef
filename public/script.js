const clickBtn = document.getElementById('clickBtn');
const message = document.getElementById('message');

let clickCount = 0;

clickBtn.addEventListener('click', () => {
    clickCount++;
    const messages = [
        'Hello! 👋',
        'You clicked me! 🎉',
        'Keep clicking! 💪',
        'Amazing! ⚡',
        'You\'re awesome! 🌟',
        'Great job! 🎊'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    message.textContent = `${randomMessage} (Clicked ${clickCount} time${clickCount !== 1 ? 's' : ''})`;
    
    // Add a fun animation
    message.style.transform = 'scale(1.1)';
    setTimeout(() => {
        message.style.transform = 'scale(1)';
    }, 200);
});

