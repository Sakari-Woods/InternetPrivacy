


    const sr = ScrollReveal({
        duration:900,
        origin:'bottom',
        delay:100,
        distance:'100px',
        reset: true,
    });
    sr.reveal('header');
    sr.reveal('.sideleft',{
        origin: 'left',
    });
    sr.reveal('.sideright',{
        origin: 'right',
    });
    sr.reveal('.center');
    
    
