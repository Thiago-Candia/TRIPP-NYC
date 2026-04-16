import React, { useState } from 'react'
import '../Styles/styles.css'
import gram1  from '../assets/Img/gram1.jpg'
import gram2  from '../assets/Img/gram2.jpg'
import gram3  from '../assets/Img/gram3.jpg'
import gram4  from '../assets/Img/gram4.jpg'
import useModal from '../Hooks/modalhook'
import ModalGram from './ModalGram'

const GramSection = () => {

    const  {isOpen, openModal, closeModal } = useModal()
    const [selectedImage, setSelectedImage] = useState(null);

    const handleOpenModal = (img) => {
        setSelectedImage(img);
        openModal();
    }

    return (
    <>
        <h2 className="gram-section__title">from the gram</h2>
        <div className="gram-section__container">
            {[gram1, gram2, gram3, gram4].map((img, i) => (
                <div key={i} className='gram-section__image-box'>
                    <button 
                        onClick={() => handleOpenModal(img)} 
                        className='gram-section__image-btn'
                    >
                            <img
                                className='gram-section__image'
                                src={img} 
                                alt={`gram-${i}`} 
                            />
                    </button>
                </div>
            ))}
        </div>
        <ModalGram isOpen={isOpen} closeModal={closeModal} imgSrc={selectedImage} /> 
    </>
    )
}

export default GramSection