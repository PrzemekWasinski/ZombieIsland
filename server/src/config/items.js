// Item configuration for consumables and their properties
export const items = {
    // Berries - Small health restoration
    "Blue Berry": {
        consumable: true,
        healthRestore: 5
    },
    "Red Berry": {
        consumable: true,
        healthRestore: 5
    },
    "Yellow Berry": {
        consumable: true,
        healthRestore: 8
    },
    "Frost Berry": {
        consumable: true,
        healthRestore: 12
    },

    // Fruits - Medium health restoration
    "Cactus Fruit": {
        consumable: true,
        healthRestore: 10
    },
    "Apple": {
        consumable: true,
        healthRestore: 8
    },
    "Coconut": {
        consumable: true,
        healthRestore: 15
    },

    // Mushrooms - Varied health restoration
    "White Mushroom": {
        consumable: true,
        healthRestore: 12
    },
    "Red Mushroom": {
        consumable: true,
        healthRestore: 18
    },
    "Ice Mushroom": {
        consumable: true,
        healthRestore: 20
    },
    "Ice Flower": {
        consumable: true,
        healthRestore: 22
    },

    // Potions - Large health restoration
    "Small Healing Potion": {
        consumable: true,
        healthRestore: 25
    },
    "Medium Healing Potion": {
        consumable: true,
        healthRestore: 50
    },
    "Large Healing Potion": {
        consumable: true,
        healthRestore: 75
    },

    // Non-consumable resources
    "Wood": {
        consumable: false
    },
    "Stone": {
        consumable: false
    },
    "Gem": {
        consumable: false
    },
    "Diamond": {
        consumable: false
    },
    "Ruby": {
        consumable: false
    },
    "Sand": {
        consumable: false
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
