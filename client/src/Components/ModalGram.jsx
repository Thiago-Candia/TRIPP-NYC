import React, { useEffect } from 'react'
import '../Styles/styles.css'

const ModalGram = ({isOpen, closeModal, imgSrc}) => {

    if (!isOpen) return null

    //si el usuario apreta esc dentro del modal se cierra
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape"){
                closeModal()
            }
        }
        if(isOpen){
            window.addEventListener('keydown', handleEsc)
        }
        return () => {
            window.removeEventListener('keydown', handleEsc)
        }
    }, [isOpen, closeModal])


    return (
    <div className='modal-gram-container'>
        <div className='modal-gram-img-box'>
            <img src={imgSrc} alt="" />
        </div>
        <div>wwww
            <div className='modal-gram-item'>
                <span>Hola</span>
            </div>
            <div className='modal-gram-item'>
            </div>
            <div className='modal-gram-item'>
            </div>
            <div className='modal-gram-item'>
            </div>
        </div>
    </div>
    )
}

export default ModalGram