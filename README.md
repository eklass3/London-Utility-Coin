# London Utility Coin

This is the complete backend code for the London Utility Coin (LUC) Hyperledger Fabric blockchain. LUC is a cryptocoin which incentives users to save on utility usage using the motivation of a simple cryptocurrency. LUC can be traded to benefit utility users who may be struggling to pay bills and can be collected by simply using less utilities than others.  

LUC uses Hyperledger Fabric Blockchain with the Hyperledger Composer framework.

### Other Projects using LUC
-  London Utility Coin Portal (LUC front-end access portal).
- [London Utility Coin Arduino Package (LUC meter hardware code)](https://github.com/eklass3/LUC-Arduino).

## Installation

1. Follow the [hyperledger composer setup tutorial](https://hyperledger.github.io/composer/latest/installing/installing-index) to get pre-requisites and set up the development environment.

2. Once the development environment is set up, pull the london-utility-coin project to the fabric-dev-servers folder. 

Set up complete!


## Usage

### Start up:

1. Run following command in your fabric-dev-servers folder.

```bash
./startFabric.sh
./createPeerAdminCard.sh
```

2. Run following commands in your /fabric-dev-servers/london-utility-coin:
			
```bash
composer archive create -t dir -n .
composer network install --card PeerAdmin@hlfv1 --archiveFile london-utility-coin@{CURRENT_LUC_VERSION}.bna
composer network start --networkName london-utility-coin --networkVersion {CURRENT_LUC_VERSION} --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer card import --file networkadmin.card
```
3. Check if LUC is up and running.
```bash
composer network ping --card admin@london-utility-coin
```
###  Development Options:
Working on LUC or any hyperledger blockchain can be tricky. I recommend using **Hyperledger composer playground**  *note this is depreciated as of August 2019, but still works well for now.

To start playground run this command in your london-utility-coin directory:
```bash
composer-playground
```
**Composer REST API**
It is easy to start the REST server API for LUC.
Run this command in your london-utility-coin directory:
```bash
composer-rest-server
```

### Shut down:

1. Run the following commands in your fabric-dev-servers folder.
```bash
./stopFabric.sh
./teardownFabric.sh
```

*LUC runs on the hyperledger composer framework. For more detailed (and better) information on many of these commands see the [composer documentation.]([https://hyperledger.github.io/composer/latest/index.html](https://hyperledger.github.io/composer/latest/index.html))*

## Contributing
LUC is run by a undergraduate student! I would love to receive contributions towards this project 

## License
[MIT](https://choosealicense.com/licenses/mit/)
