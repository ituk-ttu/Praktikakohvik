import './Firms.css';
import { useContext, useState, useEffect } from "react";
import { srcContext } from "../SrcContext.js";
import FirmsInfo from './FirmsInfo';
import FirmsMap from './FirmsMap';
import FirmsInfoPlaceholder from './FirmsInfoPlaceholder';

const Firms = () => {
    const { language } = useContext(srcContext);
    const [ mapStatus, setMapStatus ] = useState(false);
    const [ firms, setFirms ] = useState([]);
    const [ selectedFirm, setSelectedFirm ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ clicked, setClicked ] = useState(false);

    useEffect(() => {
		loadFirms(setFirms, setMapStatus, setLoading)
    }, []);

    function click(firm) {
		setClicked(true)
		if (firm.id !== selectedFirm.id)
		{
			let filteredFirm = firms.filter(function(x) { return x.id === firm.id; });
			setSelectedFirm(...filteredFirm)
		}
    }

    return (
        <div className="container-firms">
			<div className="container-grid">
				<h2 id='firms-title'>{language.firms.firmsTitle}</h2>
				<section className="firms-list">
					<ul>
						{
							firms.map((firm) => (
								<li key={firm.name}>
									<button className={firm.name === selectedFirm.name ? 'active' : ''} onClick={() => click(firm)}>
										<h3>{firm.name}</h3>
									</button>
								</li>
							))
						}
					</ul>
				</section>

				<section className="firms-map">
					{
						mapStatus
							?	<FirmsMap selectedFirm={selectedFirm} firms={firms} clickFunction={click} />
							:	<FirmsMap selectedFirm={selectedFirm} firms={[]} clickFunction={click} />
					}
				</section>
				
				<section className="firms-info">
					{ 
						!clicked
							? <FirmsInfoPlaceholder isLoading={loading} firmsCount={firms.length} />
							: <FirmsInfo selectedFirm={selectedFirm} />  
					}
				</section>
			</div>
        </div>
    )
};

export default Firms;

const loadFirms = async (setFirms, setMapStatus, setLoading) => {
	const response = await fetch('https://pkapi.onrender.com/api/firms')
	const data = await response.json()

	if (data) {
		setFirms(data.firms)
		setMapStatus(data.displayMap)
		setLoading(false)
		const promises = data.firms.map(f => preloadImages(f.id))
	 	await Promise.all(promises)
	}
}

let images = []
function preloadImages(id) {
	let img = new Image()
	img.src = 'https://pkapi.onrender.com/api/firms/' + id + '/image/1';
	images.push(img)
}
