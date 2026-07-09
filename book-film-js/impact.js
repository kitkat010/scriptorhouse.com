const impactSection = document.querySelector(".development-impact-section");

const impactObserver = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

impactSection.classList.add("active");

}else{

impactSection.classList.remove("active");

}

});

},{threshold:.45});

impactObserver.observe(impactSection);