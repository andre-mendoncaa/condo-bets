import React from 'react';

export default function SureBetCalculator() {
    
    const openSureBetSite = () => {
        window.open('https://pt.surebet.com/calculator', '_blank');
    };

    return (
        <div className="container">
            <p>Por enquanto vamos usar a do site que já está pronto, é mais complexo do que eu pensava!</p>
            <br></br>
            <button className="surebet-button" onClick={openSureBetSite}>
                🔗 Abra a calculadora de SureBet Aqui!
            </button>
        </div>
    );
}

// Estilos em CSS
const styles = `
    .container {
        text-align: center;
        margin-top: 20px;
    }
    .surebet-button {
        background-color: #007BFF;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
    }
    .surebet-button:hover {
        background-color: #0056b3;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
