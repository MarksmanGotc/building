document.addEventListener('DOMContentLoaded', function() {
    // Kun footerin sisällä olevaa SVG:tä painetaan
    document.querySelectorAll('footer svg, #openGiftFromHeader').forEach(element => {
		element.addEventListener('click', function() {
			const pageDivs = document.querySelectorAll('.page > div');
			const giftDiv = document.querySelector('.page .gift');

			pageDivs.forEach(div => {
				div.style.display = 'none';
			});
			giftDiv.style.display = 'flex';
			gtag('event', 'donate_click', {
				'event_label_gift': 'Open domnate views'
			});
		});
	});

    document.querySelector('.gift button').addEventListener('click', function() {
        const pageDivs = document.querySelectorAll('.page > div');
        const wrapperDiv = document.querySelector('.page .wrapper');

        pageDivs.forEach(div => {
            div.style.display = 'none';
        });

        wrapperDiv.style.display = 'block';
    });
});


function loadBuildings(buildingSelectElement) {
    buildingSelectElement.innerHTML = '';
    
    // Hae rakennusten nimet ja lajittele ne aakkosjärjestykseen
    const sortedBuildings = Object.keys(build).sort();

    // Lisää järjestetyt rakennukset valikkoon
    sortedBuildings.forEach(building => {
        let option = document.createElement('option');
        option.value = building;
        option.textContent = building;
        buildingSelectElement.appendChild(option);
    });

}


function addAnotherBuilding() {
    document.querySelectorAll('.buildingBlock.start').forEach(function(element) {
        element.classList.remove('start');
    });
    document.querySelectorAll('.buildingBlock.animated').forEach(function(element) {
        element.classList.remove('animated');
    });

    var newBuildingDiv = document.createElement('div');
    newBuildingDiv.className = 'buildingBlock animated';

    var container = document.getElementById('buildingBlocksContainer');

    // Luo ja lisää poistonappi
    var removeButton = document.createElement('div');
    removeButton.innerHTML = '<p><svg xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><!--!Font Awesome Pro 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.--><path d="M326.6 166.6L349.3 144 304 98.7l-22.6 22.6L192 210.7l-89.4-89.4L80 98.7 34.7 144l22.6 22.6L146.7 256 57.4 345.4 34.7 368 80 413.3l22.6-22.6L192 301.3l89.4 89.4L304 413.3 349.3 368l-22.6-22.6L237.3 256l89.4-89.4z"/></svg></p>';
    removeButton.className = 'removeButton';

	document.getElementById('buildingBlocksContainer').addEventListener('click', function(event) {
		if (event.target.closest('.removeButton')) {
			var buildingBlock = event.target.closest('.buildingBlock');
			if (buildingBlock) {
				buildingBlock.remove();
				gtag('event', 'remove_building_click', {
					'event_label': 'remove Building'
				});
			}
		}
	});

    newBuildingDiv.appendChild(removeButton);

    newBuildingDiv.innerHTML += `
        <div class="selectBuilds">
            <div class="selectBuild">
                <label for="buildingSelect">Select Building:</label>
                <select class="buildingSelect"></select>
            </div>
        </div>
        <div class="selectLevel">
            <div class="currentLevel">
                <label for="currentLevel">Current level:</label>
                <input type="number" class="currentLevel" min="0" max="39" value="0">
            </div>
            <div class="targetLevel">
                <label for="targetLevel">Update level:</label>
                <input type="number" class="targetLevel" min="1" max="40" value="40">
            </div>
        </div>`;

    container.appendChild(newBuildingDiv);

    var newBuildingSelect = newBuildingDiv.querySelector('.buildingSelect');

    loadBuildings(newBuildingSelect);
	
	adjustLevelInputs(newBuildingDiv);
	
    gtag('event', 'add_building_click', {
        'event_label': 'Add Building'
    });

    var scrollTargetPosition = newBuildingDiv.offsetTop - 20;
    window.scrollTo({ top: scrollTargetPosition, behavior: 'smooth' });

    setTimeout(() => newBuildingDiv.classList.remove('animated'), 4000);
}


function calculateCost() { 
    var totalCosts = { food: 0, wood: 0, stone: 0, iron: 0, brick: 0, pine: 0, keystone: 0, valyrianStone: 0, blackstone: 0, upgradeTime: 0 };
    var totalDiscounts = { food: 0, wood: 0, stone: 0, iron: 0, brick: 0, pine: 0, keystone: 0, valyrianStone: 0, blackstone: 0, upgradeTime: 0 };
    var costSummaryElement = document.getElementById('costSummary');
    var numberFormatter = new Intl.NumberFormat('en-US');
    var wrapperElement = document.querySelector('.wrapper');
    
    costSummaryElement.innerHTML = '';
	
    const resourceIcons = {
        food: '/building/food.png',
        wood: '/building/wood.png',
        stone: '/building/stone.png',
        iron: '/building/iron.png',
        brick: '/building/brick.png',
        pine: '/building/pine.png',
        keystone: '/building/keystone.png',
        valyrianStone: '/building/valyrianstone.png',
        blackstone: '/building/blackstone.png'
    };

	if (!document.getElementById('closeResults')) {
        let closeButton = document.createElement('button');
        closeButton.id = 'closeResults';
        
        closeButton.innerHTML = `
            <span>Click here to go back and modify your selections</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M345 137c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-119 119L73 103c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l119 119L39 375c-9.4-9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l119-119L311 409c9.4-9.4 24.6-9.4 33.9 0s9.4-24.6 0-33.9l-119-119L345 137z"></path>
            </svg>`;

        closeButton.addEventListener('click', function() {
            document.querySelector('.wrapper').style.display = 'block';
            costSummaryElement.style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        costSummaryElement.prepend(closeButton);
	}

    var buildingBlocks = document.querySelectorAll('.buildingBlock');
    for (let i = 0; i < buildingBlocks.length; i++) {
        let block = buildingBlocks[i];
        let buildingSelect = block.querySelector('.buildingSelect');
        let currentLevelInput = block.querySelector('.currentLevel input');
        let targetLevelInput = block.querySelector('.targetLevel input');
        let currentLevel = parseInt(currentLevelInput.value, 10);
        let targetLevel = parseInt(targetLevelInput.value, 10);

        let selectedBuilding = buildingSelect.value;
        let buildingData = build[selectedBuilding];

        var blockCosts = { food: 0, wood: 0, stone: 0, iron: 0, brick: 0, pine: 0, keystone: 0, valyrianStone: 0, blackstone: 0, upgradeTime: 0 };
        var blockDiscounts = { food: 0, wood: 0, stone: 0, iron: 0, brick: 0, pine: 0, keystone: 0, valyrianStone: 0, blackstone: 0, upgradeTime: 0 };
        var reqs = '';

        for (let j = currentLevel; j < targetLevel; j++) {
            let levelData = buildingData[j];

            levelData.price.forEach(priceItem => {
                let costType = priceItem.Type;

                if (costType === 'Reqs') {
                    reqs = priceItem.Value;
                    return;
                }

                if (costType === 'Upgrade Time') {
                    costType = 'upgradeTime';  
                } else if (costType === 'ValyrianStone') {
                    costType = 'valyrianStone'; 
                } else {
                    costType = costType.toLowerCase().replace(' cost', '');
                }

                let originalCost = priceItem.Value;

                let discountElement = document.querySelector('.ale' + costType.charAt(0).toUpperCase() + costType.slice(1));
                let discount = discountElement ? parseFloat(discountElement.value) || 0 : 0;

                let discountedCost = Math.round((100 / (discount + 100)) * originalCost);
                blockDiscounts[costType] += originalCost - discountedCost;
                blockCosts[costType] += discountedCost;
            });
        }

        var blockCostDiv = document.createElement('div');
        blockCostDiv.classList.add('costBox');
        blockCostDiv.innerHTML = `
            <h4>${selectedBuilding}</h4>
            <p class="level">Level ${currentLevel} to ${targetLevel}</p>
        `;

        for (let key in blockCosts) {
            if (key === 'upgradeTime') {
                const efficiencyClass = blockDiscounts[key] > 0 ? 'efficiency' : '';
                blockCostDiv.innerHTML += `<p class="${efficiencyClass}">Upgrade Time: ${formatTime(blockCosts[key])}</p>`;
            } else if (blockCosts[key] > 0) {
                const efficiencyClass = blockDiscounts[key] > 0 ? 'efficiency' : '';
                blockCostDiv.innerHTML += `
                    <div class="resources ${efficiencyClass}">
                        <img src="${resourceIcons[key]}" alt="${key} icon">
                        <p>${numberFormatter.format(blockCosts[key])}</p>
                    </div>
                `;
            }
            totalCosts[key] += blockCosts[key];
            totalDiscounts[key] += blockDiscounts[key];
        }
        costSummaryElement.appendChild(blockCostDiv);
    }

    if (buildingBlocks.length > 1) {
        var totalCostDiv = document.createElement('div');
        totalCostDiv.classList.add('totalCosts');
        totalCostDiv.innerHTML = `<h3>Costs in total:</h3>`;

        for (let key in totalCosts) {
            if (key === 'upgradeTime') {
                const efficiencyClass = totalDiscounts[key] > 0 ? 'efficiency' : '';
                totalCostDiv.innerHTML += `<p class="${efficiencyClass}">Upgrade Time: ${formatTime(totalCosts[key])}</p>`;
            } else if (totalCosts[key] > 0) {
                const efficiencyClass = totalDiscounts[key] > 0 ? 'efficiency' : '';
                totalCostDiv.innerHTML += `
                    <div class="resources ${efficiencyClass}">
                        <img src="${resourceIcons[key]}" alt="${key} icon">
                        <p>${numberFormatter.format(totalCosts[key])}</p>
                    </div>
                `;
            }
        }
        costSummaryElement.appendChild(totalCostDiv);
    }

    wrapperElement.style.display = 'none';
    costSummaryElement.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}




// Ajan muotoilu funktio
function formatTime(seconds) {
    let days = Math.floor(seconds / 86400);
    let hours = Math.floor((seconds % 86400) / 3600);
    let formattedTime = '';

    if (days > 0) {
        formattedTime += `${days}d `;
        formattedTime += `${hours}h`;
    } else if (hours > 0) {
        formattedTime += `${hours}h`;
    } else {
        formattedTime += `${seconds} s`;
    }

    return formattedTime.trim();
}




// Kutsu funktioita sivun latautuessa
document.addEventListener('DOMContentLoaded', function() {
    var buildingSelectElements = document.querySelectorAll('.buildingSelect');
    buildingSelectElements.forEach(function(buildingSelectElement) {
        loadBuildings(buildingSelectElement);
    });

	document.querySelectorAll('.buildingSelect').forEach(function(buildingSelectElement) {
		buildingSelectElement.addEventListener('change', function() {
			var enhancementSelect = this.parentNode.parentNode.querySelector('.enhancementSelect');
			loadEnhancements(enhancementSelect);
		});
	});

    // Aseta currentLevel ja targetLevel -kenttien säätölogiikka kaikille buildingBlock-elementeille
    document.querySelectorAll('.buildingBlock').forEach(adjustLevelInputs);
})


function adjustLevelInputs(buildingBlock) {
    var currentLevelInput = buildingBlock.querySelector('.currentLevel input');
    var targetLevelInput = buildingBlock.querySelector('.targetLevel input');

    currentLevelInput.addEventListener('change', function() {
        var currentLevel = parseInt(currentLevelInput.value, 10);
        targetLevelInput.min = currentLevel+1;

        if (parseInt(targetLevelInput.value, 10) <= currentLevel) {
            targetLevelInput.value = currentLevel+1;
        }
    });
	targetLevelInput.addEventListener('change', function() {
        var currentLevel = parseInt(currentLevelInput.value, 10);
        var targetLevel = parseInt(targetLevelInput.value, 10);
        if (targetLevel <= currentLevel) {
            targetLevelInput.value = currentLevel + 1;
        }
    });
}


function smoothScrollTo(elementId) {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) return;

    const targetPosition = targetElement.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 500;
    let start = null;

    window.requestAnimationFrame(step);

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const fraction = easeInOutCubic(progress / duration);
        window.scrollTo(0, startPosition + distance * fraction);
        if (progress < duration) window.requestAnimationFrame(step);
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}
