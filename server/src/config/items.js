// Item configuration for consumables and their properties
export const items = {
    // Berries - Small health restoration
    "Blue Berry": {
        consumable: true,
        healthRestore: 5,
        value: 5
    },
    "Red Berry": {
        consumable: true,
        healthRestore: 5,
        value: 5
    },
    "Yellow Berry": {
        consumable: true,
        healthRestore: 8,
        value: 8
    },
    "Frost Berry": {
        consumable: true,
        healthRestore: 12,
        value: 15
    },

    // Fruits - Medium health restoration
    "Cactus Fruit": {
        consumable: true,
        healthRestore: 10,
        value: 12
    },
    "Apple": {
        consumable: true,
        healthRestore: 8,
        value: 7
    },
    "Coconut": {
        consumable: true,
        healthRestore: 15,
        value: 15
    },

    // Mushrooms - Varied health restoration
    "White Mushroom": {
        consumable: true,
        healthRestore: 12,
        value: 10
    },
    "Red Mushroom": {
        consumable: true,
        healthRestore: 18,
        value: 18
    },
    "Ice Mushroom": {
        consumable: true,
        healthRestore: 20,
        value: 20
    },
    "Ice Flower": {
        consumable: true,
        healthRestore: 22,
        value: 22
    },

    // Potions - Large health restoration
    "Small Health Potion": {
        consumable: true,
        healthRestore: 25,
        value: 25
    },
    "Medium Health Potion": {
        consumable: true,
        healthRestore: 50,
        value: 75
    },
    "Large Health Potion": {
        consumable: true,
        healthRestore: 100,
        value: 150
    },

    // Non consumable resources
    "Wood": {
        consumable: false,
        value: 10
    },
    "Stone": {
        consumable: false,
        value: 5
    },
    "Gem": {
        consumable: false,
        value: 50
    },
    "Diamond": {
        consumable: false,
        value: 150
    },
    "Ruby": {
        consumable: false,
        value: 120
    }
};

// Helper function to check if an item is consumable
export function isConsumable(itemName) {
    const item = items[itemName];
    return item ? item.consumable : false;
}

// Helper function to get health restoration amount
export function getHealthRestore(itemName) {
    const item = items[itemName];
    return item && item.consumable ? item.healthRestore : 0;
}

// Helper function to get item sell value
export function getItemValue(itemName) {
    const item = items[itemName];
    return item ? item.value : 0;
}
