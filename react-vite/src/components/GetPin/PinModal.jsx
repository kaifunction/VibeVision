import { useModal } from "../../context/Modal"

const PinModal = ( {pinImage} ) => {
     const { closeModal } = useModal();

     const backToPin = async (e) => {
          e.preventDefault();
          closeModal()
     };

     return(
          <div style={{display: "flex", flexDirection: "column", gap: '10px'}}>
                <img src={pinImage} alt="Pin image" style={{ width: "400px", borderBottom: '1px solid #d3f712' }} />
               <button onClick={backToPin} style={{borderColor: "#ffffff", backgroundColor: "#d3f71290", padding:'5px'}}>BACK</button>
          </div>
     )
}

export default PinModal;
