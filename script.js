 <script>
        document.addEventListener('DOMContentLoaded', function() {
            animateProgress('lessons-count', 42, 1500);
            animateProgress('streak-count', 18, 1500);
            animateProgress('level-percent', '78%', 1500);
            setTimeout(() => {
                setProgress('grammar-progress', 'grammar-percent', 85);
                setProgress('vocabulary-progress', 'vocabulary-percent', 72);
                setProgress('speaking-progress', 'speaking-percent', 63);
            }, 500);
            const fadeElements = document.querySelectorAll('.fade-in');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            
            fadeElements.forEach(element => {
                observer.observe(element);
            });
            document.querySelectorAll('.btn-primary, .btn-light').forEach(button => {
                button.addEventListener('click', function() {
                    alert('Добро пожаловать в LinguaFlow! Регистрация открыта.');
                });
            });
            function animateProgress(elementId, target, duration) {
                const element = document.getElementById(elementId);
                let current = 0;
                const increment = target / (duration / 16); // 60fps
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = typeof target === 'string' ? target : Math.floor(target);
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current);
                    }
                }, 16);
            }
            
            function setProgress(barId, percentId, percent) {
                const bar = document.getElementById(barId);
                const percentElement = document.getElementById(percentId);
                
                bar.style.width = '0%';
                percentElement.textContent = '0%';
                
                setTimeout(() => {
                    bar.style.width = percent + '%';
                    percentElement.textContent = percent + '%';
                }, 300);
            }
        });
    </script>