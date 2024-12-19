# Zombie Island

This is a 2D survival web game I made for a second year University project, it has features such as a health system, fighting system, a round system where the game gets harder every roud, enemies that chase the player and drop items after dying and a map with obstacles.

The game's website also features a login and register feature where the user has to create an account and login to it before playing, this is so their user gets a score which can be displayed on the `rankings` page, the details are stored in HTML local storage which is used as a database for user's accounts following the university project requirements

![game](https://github.com/user-attachments/assets/525a1694-fa0c-485b-aa7c-5497e3b490ca)

The player starts on a deserted island with zombies, they must defeat as many zombies as possible and survive for as long as possible while collecting hearts to heal up and increasing their score for every zombie they defeat.


![attack2(1)](https://github.com/user-attachments/assets/49f50578-743b-4861-8a47-02ff3a7638dd) ![attack1](https://github.com/user-attachments/assets/4ab0a107-e1a1-498e-abb0-950fd8a5a481)

When the player punches they will deal damage to the zombie in front and the zombies around it within 1 tile, this makes the game more balanced in difficulty. This is shown in the images above, where each zombie in the blue area will be hurt when the player starts punching based on which direction the player is facing.

![game-over](https://github.com/user-attachments/assets/800ccbd3-2d35-444a-b78a-4d8c24a9bd58)

When the player's health reaches 0 the game will end and give the player the choice to quit or restart, if the player's current score is higher than the one saved it will be replaced and it can be seen on the `rankings` page.
