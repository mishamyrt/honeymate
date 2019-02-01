const animations = () => {
    const animationsNode = document.querySelector('.animations-container')
    setInterval(() => {
        animationsNode.style.opacity = '1';
        setTimeout(() => {
            animationsNode.classList.add('is__visible')
            setTimeout(() => {
                animationsNode.style.opacity = '0';
                setTimeout(() => {
                    animationsNode.classList.remove('is__visible')
                }, 500)
            }, 1500)
        }, 1000)
    }, 3100)
    // setTimeout(() => {
    //     animationsNode.classList.toggle('is__visible')
    // }, 4000)
}

const app = () => {
    animations()
}

// document.addEventListener('DOMContentLoaded', app)
app()