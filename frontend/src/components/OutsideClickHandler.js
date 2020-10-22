import { useRef, useState, useEffect } from 'react'

export const OutsideClickHandler = (initialValue) => {
    const ref = useRef(null)
    const [visible, setVisible] = useState(initialValue)
    
    const clickOutsideHandler = (event) => {
        console.log(ref)
        if(ref.current && !ref.current.contains(event.target)) {setVisible(false)}

        // const navBtn = document.getElementById("nav-toggle-btn")
        // const navBtnClass = document.getElementsByClassName("collapse")
        // if(!navBtn.include(navBtnClass)){
        //     navBtn.setAttribute("class", "collapse")
        // }
    }
    

    useEffect(() => {
        
        
        document.addEventListener('click', clickOutsideHandler, true)
        //document.addEventListener('keydown', keyPressHandler, true)

        return () => {
            document.removeEventListener('click', clickOutsideHandler, true)
            //document.removeEventListener('keydown', keyPressHandler, true)
        }
    }, [ref])

    return {visible, setVisible, ref}
}