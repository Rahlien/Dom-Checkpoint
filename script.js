/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here
 let coffeeCount = document.getElementById('coffee_counter')
  
  return coffeeCount.innerText = coffeeQty
}


function clickCoffee(data) {
  // your code here
  // let coffeeCount = document.getElementById('coffee_counter')  
  
  data.coffee++
  
  updateCoffeeView(data.coffee)
  
  renderProducers(data)
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  
  let data = producers
    
    for (let i = 0; i < data.length; i++){
      
      if (coffeeCount >= (data[i].price / 2)){
        data[i].unlocked = true
      }
    
    }
  
}

function getUnlockedProducers(data) {
  // your code here
  
  let producers = data.producers
  let producerArr = []
  
  for (let i = 0; i < producers.length; i++){
    if (producers[i].unlocked === true){
      producerArr.push(producers[i])
    }
  }
  return producerArr
}

function makeDisplayNameFromId(id) {
  // your code here
  let newId = id.replaceAll('_', ' ')
  
  
  String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){
      return txt.charAt(0)
                .toUpperCase() + txt
                .substr(1)
                .toLowerCase();});
  };
  
  return newId.toProperCase()
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function renderProducers(data) {
  // your code here
  let container = document.getElementById('producer_container')
  
  deleteAllChildNodes(container)
  
  unlockProducers(data.producers, data.coffee)
  
  getUnlockedProducers(data)
  
  for (let i = 0; i < data.producers.length; i++){
    let render = makeProducerDiv(data.producers[i])
    if(data.producers[i].unlocked === true){
      container.appendChild(render)
    }
    
  }
  
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  for (let i = 0; i < data.producers.length; i++){
    if (data.producers[i].id === producerId){
      return data.producers[i]
    }
  }
}

function canAffordProducer(data, producerId) {
  // your code here
  let item = getProducerById(data, producerId)
  
  return (data.coffee >= item.price)
  
  
}

function updateCPSView(cps) {
  // your code here
  let count = document.getElementById('cps')
  
  count.innerText = cps
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(oldPrice * 1.25)
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  let bought = canAffordProducer(data, producerId)
  let producer = getProducerById(data, producerId)
  
  if(bought){ 
    producer.qty += 1
    data.coffee -= producer.price
    producer.price = updatePrice(producer.price)
    data.totalCPS = producer.cps
    
    return bought
  }
  return bought
}

function buyButtonClick(event, data) {
  // your code here
  let producerId
  let bought
  let producer
  
  if(event.target.id){
  producerId = event.target.id.slice(4)
  bought = attemptToBuyProducer(data, producerId)
  producer = getProducerById(data, producerId)
  
  renderProducers(data)
  updateCoffeeView(data.coffee)
  updateCPSView(producer.cps)
  }
  
  if(bought === false){
    window.alert('Not enough coffee!')
  }
  
}

function tick(data) {
  // your code here
  let newCoffeeCount = data.coffee += data.totalCPS
  
  updateCoffeeView(newCoffeeCount)
  
  renderProducers(data)
  
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
