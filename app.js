/**
 * Parent constructor of all humans, dinos, and birds.
 *
 * @param species
 *   Type of animal
 * @param weight
 *   Weight of animal
 * @param height
 *   Height of animal
 * @param diet
 *   Type of diet of animal (herbivore, omnivor, carnivor)
 * @constructor
 */
function Animal (species, weight, height, diet) {
  this.species = species
  this.weight = weight
  this.height = height
  this.diet = diet
  this.image = buildImage(this.species)
}

/**
 * Child class - represents dinos and birds.
 *
 * @param species
 *   Type of animal
 * @param weight
 *   Weight of animal
 * @param height
 *   Height of animal
 * @param diet
 *   Type of diet of animal (herbivore, omnivor, carnivor)
 * @param where
 *   Where they lived
 * @param when
 *   When they lived
 * @param fact
 *   Little know fact about them
 * @constructor
 */
function Archosaur (species, weight, height, diet, where, when, fact) {
  Animal.call(this, species, weight, height, diet)
  this.where = where
  this.when = when
  this.fact = fact
}

Archosaur.prototype = Object.create(Animal.prototype)
Archosaur.prototype.constructor = Archosaur

// Generates HTML for tiles.
Archosaur.prototype.getTile = function (human) {
  const arg = this.species !== 'Pigeon' ? human : null
  return `
        <div class="grid-item">
            <h3>${this.species}</h3>
            <img src="images/${this.image}" /> 
            <p>${this.getFact(arg)}</p>
        </div>
    `
}

// Determines whether to use a static fact (Pigeon) or a randomly generated fact.
Archosaur.prototype.getFact = function (human) {
  if (this.species === 'Pigeon') {
    return this.fact
  } else {
    return this.chooseFact(human)
  }
}

// Randomly generates facts from 6 different types based on comparisons and properties.
// Store the functions that generate the facts in an array, then randomly chooses one of them.
Archosaur.prototype.chooseFact = function (human) {
  const comparisons = []

  // Comparison of dino and human height.
  const heightCompare = function () {
    if (this.height > human.height) {
      return `${this.species} is taller than you`
    } else if (this.height === human.height) {
      return `You are the same height as a ${this.species}`
    } else {
      return `${this.species} is shorter than you`
    }
  }

  // Comparison of dino and human weight.
  const weightCompare = function () {
    if (this.weight > human.weight) {
      return `${this.species} is heavier than you`
    } else if (this.weight === human.weight) {
      return `You are the same weight as a ${this.species}`
    } else {
      return `${this.species} is lighter than you`
    }
  }

  // Comparison of dino and human diet.
  const dietCompare = function () {
    if (this.diet.toLowerCase() === human.diet.toLowerCase()) {
      return `You have the same diet as a ${this.species}`
    } else {
      return `You have a different diet than a ${this.species}`
    }
  }

  // Where the dinos lived.
  const where = function () {
    return `The ${this.species} lived in ${this.where}`
  }

  // When the dinos lived.
  const when = function () {
    return `The ${this.species} lived during the ${this.when} period`
  }

  // The raw fact provided by the json file.
  const rawFact = function () {
    return `${this.fact}`
  }

  // Gather the facts into an array.
  comparisons.push(heightCompare.call(this))
  comparisons.push(weightCompare.call(this))
  comparisons.push(dietCompare.call(this))
  comparisons.push(where.call(this))
  comparisons.push(when.call(this))
  comparisons.push(rawFact.call(this))

  // Randomly choose one of the facts in the array.
  return comparisons[getRandomInt(comparisons.length - 1)]
}

/**
 *
 * @param weight
 *   Weight of animal
 * @param height
 *   Height of animal
 * @param diet
 *   Type of diet of animal (herbivore, omnivor, carnivor)
 * @param name
 *   Name of the person
 * @constructor
 */
function Human (weight, height, diet, name) {
  Animal.call(this, 'human', weight, height, diet)
  this.name = name
}

Human.prototype = Object.create(Animal.prototype)
Human.prototype.constructor = Human
Human.prototype.getTile = function () {
  return `
        <div class="grid-item">
            <h3>${this.name}</h3>
            <img src="images/${this.image}" /> 
        </div>
    `
}

// Fetch the dinos from the json file and create an array of objects.
let dinos = ''
fetch('./dino.json')
  .then(response => {
    return response.json()
  })
  .then(function (data) {
    // Create dino objects.
    dinos = createDinos(data.Dinos)
  })

// Helper function for creating Dino objects from json.
function createDinos (dinos) {
  return dinos.map(function (dino) {
    return new Archosaur(
      dino.species,
      dino.weight,
      dino.height,
      dino.diet,
      dino.where,
      dino.when,
      dino.fact
    )
  })
}

// Submit button has been clicked, Process the form.
document.getElementById('btn').addEventListener('click', function (e) {
  // Create the human from the form entries.
  const human = new Human(
    document.getElementById('weight').value,
    calculateHeight(document.getElementById('feet').value, document.getElementById('inches').value),
    document.getElementById('diet').value,
    document.getElementById('name').value
  )

  // Create tile html.
  const dinoTile = function (dino, human) {
    return dino.getTile(human)
  }

  // Generate the HTML for the Dino tiles.
  const dinoshtml = dinos.map(dino => dinoTile(dino, human))

  // Add the human to the grid.
  dinoshtml.splice(4, 0, human.getTile())

  // Hide the form.
  document.getElementById('dino-compare').classList.add('hide')

  // Show the grid.
  document.getElementById('grid').innerHTML = dinoshtml.join('')
})

// Utility function for calculating height in inches.
function calculateHeight (feet, inches) {
  return parseInt(feet) * 12 + parseInt(inches)
}

// Utility function for setting the image paths.
function buildImage (species) {
  return species.toLowerCase() + '.png'
}

// Utility function for generating a random number.
function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}
