import { expect } from "chai";
import { Provider, types, utils, Wallet } from "../../src";
import { ethers } from "ethers";

describe("Provider", () => {
    const ADDRESS = "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049";
    const PRIVATE_KEY = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
    const RECEIVER = "0xa61464658AfeAf65CccaaFD3a512b69A83B77618";

    const provider = Provider.getDefaultProvider(types.Network.Localhost);
    const wallet = new Wallet(PRIVATE_KEY, provider);

    const DAI = require("../token.json");

    let tx = null;

    before("setup", async function () {
        this.timeout(25_000);
        tx = await wallet.transfer({
            token: utils.ETH_ADDRESS,
            to: RECEIVER,
            amount: 1_000_000,
        });
        await tx.wait();
    });

    describe("#getMainContractAddress()", () => {
        it("should return the address of main contract", async () => {
            const result = await provider.getMainContractAddress();
            expect(result).not.to.be.null;
        });
    });

    describe("#getTestnetPaymasterAddress()", () => {
        it("should return the address of testnet paymaster", async () => {
            const TESTNET_PAYMASTER = "0xfd106834e5fc159f85d8e453a3bf4e0db2f70b78";
            const result = await provider.getTestnetPaymasterAddress();
            expect(result).to.be.equal(TESTNET_PAYMASTER);
        });
    });

    describe("#l1ChainId()", () => {
        it("should return L1 chain ID", async () => {
            const L1_CHAIN_ID = 9;
            const result = await provider.l1ChainId();
            expect(result).to.be.equal(L1_CHAIN_ID);
        });
    });

    describe("getBlockNumber()", () => {
        it("should return block number", async () => {
            const result = await provider.getBlockNumber();
            expect(result).to.be.greaterThan(0);
        });
    });

    describe("#getGasPrice()", () => {
        it("should return gas price", async () => {
            const GAS_PRICE = BigInt(2_500_000_00);
            const result = await provider.getGasPrice();
            expect(result).to.be.equal(GAS_PRICE);
        });
    });

    describe("#getL1BatchNumber()", () => {
        it("should return L1 batch number", async () => {
            const result = await provider.getL1BatchNumber();
            expect(result).to.be.greaterThan(0);
        });
    });

    describe("#getBalance()", () => {
        it("should return ETH balance of the account at `address`", async () => {
            const result = await provider.getBalance(ADDRESS);
            expect(result > 0).to.be.true;
        });

        it("should return DAI balance of the account at `address`", async () => {
            const result = await provider.getBalance(
                ADDRESS,
                "latest",
                await provider.l2TokenAddress(DAI.l1Address),
            );
            expect(result > 0).to.be.true;
        });
    });

    describe("#getAllAccountBalances()", () => {
        it("should return all balances of the account at `address`", async () => {
            const result = await provider.getAllAccountBalances(ADDRESS);
            expect(Object.keys(result)).to.have.lengthOf(1); // ETH
        });
    });

    describe("#getBlockDetails()", () => {
        it("should return block details", async () => {
            const result = await provider.getBlockDetails(1);
            expect(result).not.to.be.null;
        });
    });

    describe("#getTransactionDetails(txHash)", () => {
        it("should return transaction details", async () => {
            const result = await provider.getTransactionDetails(tx.hash);
            expect(result).not.to.be.null;
        });
    });

    describe("#getBytecodeByHash(txHash)", () => {
        it("should return bytecode of a contract", async () => {
            const tokenBytecode =
                "0x0004000000000002000200000000000200000000030100190000006003300270000001070430019700030000004103550002000000010355000001070030019d000100000000001f0000008001000039000000400010043f000000000300003100000001012001900000001d0000c13d0000010f01000041000000000101041a0000011002000041000000800020043f00000109021001970000000001000414000000000303004b0000007e0000c13d000000040320008c000000850000c13d0000000103000031000000200130008c00000020040000390000000004034019000000b00000013d0000009f02300039000000200100008a000000000212016f000000400020043f0000001f0230018f000000020400036700000005053002720000002e0000613d00000000060000190000000507600210000000000874034f000000000808043b000000800770003900000000008704350000000106600039000000000756004b000000260000413d000000000602004b0000003d0000613d0000000505500210000000000454034f00000003022002100000008005500039000000000605043300000000062601cf000000000626022f000000000404043b0000010002200089000000000424022f00000000022401cf000000000262019f000000000025043500000108020000410000003f0430008c000000000400001900000000040220190000010805300197000000000605004b0000000002008019000001080550009c000000000204c019000000000202004b000001350000613d000000800900043d000001090290009c000001350000213d000000a00400043d0000010a0240009c000001350000213d00000080053000390000009f024000390000010803000041000000000652004b0000000006000019000000000603801900000108075001970000010802200197000000000872004b0000000003008019000000000272013f000001080220009c00000000020600190000000002036019000000000202004b000001350000c13d000000800240003900000000030204330000010b0230009c000001830000813d0000003f02300039000000000112016f000000400700043d0000000001170019000000000271004b000000000200001900000001020040390000010a0610009c000001830000213d0000000102200190000001830000c13d000000400010043f0000000002370436000000a0014000390000000004130019000000000454004b000001350000213d000100000009001d000200000007001d041801f60000040f00000001010000290000000202000029041802030000040f0000002001000039000001000010044300000120000004430000010c01000041000004190001042e000000040320008c000001010000c13d0000000103000031000000200130008c000000200400003900000000040340190000012c0000013d0000010703000041000001070410009c0000000001038019000000c00110021000000111011001c70418040e0000040f000000000301001900000060033002700000010703300197000000200430008c000000200400003900000000040340190000001f0540018f00000005064002720000009d0000613d00000000070000190000000508700210000000000981034f000000000909043b000000800880003900000000009804350000000107700039000000000867004b000000950000413d000000000705004b000000ac0000613d0000000506600210000000000761034f00000003055002100000008006600039000000000806043300000000085801cf000000000858022f000000000707043b0000010005500089000000000757022f00000000055701cf000000000585019f0000000000560435000100000003001f00030000000103550000000102200190000001370000613d0000009f01400039000000e00110018f000000400010043f000000200130008c000001350000413d000000800200043d000001090120009c000001350000213d000000020100036700000000030000310000001f0430018f0000000503300272000000c50000613d00000000050000190000000506500210000000000761034f000000000707043b00000000007604350000000105500039000000000635004b000000be0000413d000000000504004b000000d30000613d00000003044002100000000503300210000000000503043300000000054501cf000000000545022f000000000131034f000000000101043b0000010004400089000000000141022f00000000014101cf000000000151019f000000000013043500000000010000310000000003000414000000040420008c000001a80000613d0000010704000041000001070530009c0000000003048019000001070510009c00000000010480190000006001100210000000c003300210000000000113019f041804130000040f0003000000010355000000000301001900000060043002700000001f0340018f000101070040019d00000107044001970000000504400272000000f00000613d00000000050000190000000506500210000000000761034f000000000707043b00000000007604350000000105500039000000000645004b000000e90000413d000000000503004b000000fe0000613d00000003033002100000000504400210000000000504043300000000053501cf000000000535022f000000000141034f000000000101043b0000010003300089000000000131022f00000000013101cf000000000151019f00000000001404350000000101200190000001ed0000c13d000001f00000013d0000010703000041000001070410009c0000000001038019000000c00110021000000111011001c70418040e0000040f000000000301001900000060033002700000010703300197000000200430008c000000200400003900000000040340190000001f0540018f0000000506400272000001190000613d00000000070000190000000508700210000000000981034f000000000909043b000000800880003900000000009804350000000107700039000000000867004b000001110000413d000000000705004b000001280000613d0000000506600210000000000761034f00000003055002100000008006600039000000000806043300000000085801cf000000000858022f000000000707043b0000010005500089000000000757022f00000000055701cf000000000585019f0000000000560435000100000003001f000300000001035500000001022001900000015d0000613d0000001f01400039000000600110018f00000080011001bf000000400010043f000000200130008c000001350000413d000000800200043d000001090120009c000001890000a13d00000000010000190000041a00010430000000400200043d0000001f0430018f0000000503300272000001440000613d000000000500001900000005065002100000000007620019000000000661034f000000000606043b00000000006704350000000105500039000000000635004b0000013c0000413d000000000504004b000001530000613d0000000503300210000000000131034f00000000033200190000000304400210000000000503043300000000054501cf000000000545022f000000000101043b0000010004400089000000000141022f00000000014101cf000000000151019f000000000013043500000107010000410000000103000031000001070430009c0000000003018019000001070420009c000000000102401900000040011002100000006002300210000000000112019f0000041a00010430000000400200043d0000001f0430018f00000005033002720000016a0000613d000000000500001900000005065002100000000007620019000000000661034f000000000606043b00000000006704350000000105500039000000000635004b000001620000413d000000000504004b000001790000613d0000000503300210000000000131034f00000000033200190000000304400210000000000503043300000000054501cf000000000545022f000000000101043b0000010004400089000000000141022f00000000014101cf000000000151019f000000000013043500000107010000410000000103000031000001070430009c0000000003018019000001070420009c000000000102401900000040011002100000006002300210000000000112019f0000041a000104300000010d0100004100000000001004350000004101000039000000040010043f0000010e010000410000041a00010430000000020100036700000000030000310000001f0430018f0000000503300272000001960000613d00000000050000190000000506500210000000000761034f000000000707043b00000000007604350000000105500039000000000635004b0000018f0000413d000000000504004b000001a40000613d00000003044002100000000503300210000000000503043300000000054501cf000000000545022f000000000131034f000000000101043b0000010004400089000000000141022f00000000014101cf000000000151019f000000000013043500000000010000310000000003000414000000040420008c000001c40000c13d000000030100036700000001020000310000001f0320018f0000000502200272000001b50000613d00000000040000190000000505400210000000000651034f000000000606043b00000000006504350000000104400039000000000524004b000001ae0000413d000000000403004b000001ed0000613d00000003033002100000000502200210000000000402043300000000043401cf000000000434022f000000000121034f000000000101043b0000010003300089000000000131022f00000000013101cf000000000141019f0000000000120435000001ed0000013d0000010704000041000001070530009c0000000003048019000001070510009c00000000010480190000006001100210000000c003300210000000000113019f041804130000040f0003000000010355000000000301001900000060043002700000001f0340018f000101070040019d00000107044001970000000504400272000001dd0000613d00000000050000190000000506500210000000000761034f000000000707043b00000000007604350000000105500039000000000645004b000001d60000413d000000000503004b000001eb0000613d00000003033002100000000504400210000000000504043300000000053501cf000000000535022f000000000141034f000000000101043b0000010003300089000000000131022f00000000013101cf000000000151019f00000000001404350000000101200190000001f00000613d000000600100003900000001011001ff000004190001042e00000107010000410000000102000031000001070320009c000000000102401900000060011002100000041a00010430000000000403004b000002000000613d000000000400001900000000052400190000000006140019000000000606043300000000006504350000002004400039000000000534004b000001f90000413d00000000012300190000000000010435000000000001042d0005000000000002000400000002001d00000112020000410000000000200439000500000001001d000000040010044300000107010000410000000002000414000001070320009c0000000001024019000000c00110021000000113011001c700008002020000390418040e0000040f00000001022001900000034c0000613d000000000101043b000000000101004b000003540000613d000000400a00043d000001100100004100000000001a0435000000000100041400000005020000290000010902200197000000040320008c000500000002001d000002240000c13d0000000103000031000000200130008c00000020040000390000000004034019000002560000013d0000010704000041000001070310009c00000000010480190000010703a0009c000000000304001900000000030a40190000004003300210000000c001100210000000000131019f00000114011001c700030000000a001d0418040e0000040f000000030a000029000000000301001900000060033002700000010703300197000000200430008c000000200400003900000000040340190000001f0540018f0000000506400272000002430000613d0000000007000019000000050870021000000000098a0019000000000881034f000000000808043b00000000008904350000000107700039000000000867004b0000023b0000413d000000000705004b000002520000613d0000000506600210000000000761034f00000000066a00190000000305500210000000000806043300000000085801cf000000000858022f000000000707043b0000010005500089000000000757022f00000000055701cf000000000585019f0000000000560435000100000003001f00030000000103550000000102200190000003b40000613d0000001f01400039000000600210018f0000000001a20019000000000221004b000000000200001900000001020040390000010a0410009c0000034e0000213d00000001022001900000034e0000c13d000000400010043f000000200130008c0000034c0000413d00000000010a0433000001090210009c0000034c0000213d00000112020000410000000000200439000000040010044300000107010000410000000002000414000001070320009c0000000001024019000000c00110021000000113011001c700008002020000390418040e0000040f00000001022001900000034c0000613d000000000101043b000000000101004b000003690000613d0000010f01000041000000000201041a00000115022001970000000505000029000000000252019f000000000021041b000000400100043d000300000001001d00000107010000410000000002000414000001070320009c0000000001024019000000c00110021000000116011001c70000800d0200003900000002030000390000011704000041041804090000040f00000001012001900000034c0000613d00000004010000290000000021010434000000000101004b0000034b0000613d000200000002001d0000011001000041000000030a00002900000000001a043500000000010004140000000502000029000000040320008c0000029b0000c13d0000000103000031000000200130008c00000020040000390000000004034019000002cc0000013d0000010704000041000001070310009c00000000010480190000010703a0009c000000000304001900000000030a40190000004003300210000000c001100210000000000131019f00000114011001c70418040e0000040f000000030a000029000000000301001900000060033002700000010703300197000000200430008c000000200400003900000000040340190000001f0540018f0000000506400272000002b90000613d0000000007000019000000050870021000000000098a0019000000000881034f000000000808043b00000000008904350000000107700039000000000867004b000002b10000413d000000000705004b000002c80000613d0000000506600210000000000761034f00000000066a00190000000305500210000000000806043300000000085801cf000000000858022f000000000707043b0000010005500089000000000757022f00000000055701cf000000000585019f0000000000560435000100000003001f00030000000103550000000102200190000003da0000613d0000001f01400039000000600110018f0000000004a10019000000000114004b000000000100001900000001010040390000010a0240009c0000034e0000213d00000001011001900000034e0000c13d000000400040043f000000200130008c0000034c0000413d00000003010000290000000005010433000001090150009c0000034c0000213d000001180140009c0000034e0000213d0000006001400039000000400010043f000000400140003900000119020000410000000000210435000000270100003900000000021404360000011a01000041000100000002001d000000000012043500000112010000410000000000100439000000040050044300000107010000410000000002000414000001070320009c0000000001024019000000c00110021000000113011001c70000800202000039000300000004001d000500000005001d0418040e0000040f000000050600002900000001022001900000034c0000613d000000000101043b000000000101004b0000037e0000613d000000040100002900000000020104330000000001000414000000040360008c000003040000c13d00000001020000390000000103000031000003190000013d0000010703000041000001070420009c000000000203801900000060022002100000000205000029000001070450009c000000000403001900000000040540190000004004400210000000000242019f000001070410009c0000000001038019000000c001100210000000000112019f0000000002060019041804130000040f000000010220018f00030000000103550000006001100270000101070010019d00000107031001970000006001000039000000000403004b000003490000613d0000010a0130009c0000034e0000213d0000003f01300039000000200400008a000000000441016f000000400100043d0000000004410019000000000514004b000000000500001900000001050040390000010a0640009c0000034e0000213d00000001055001900000034e0000c13d000000400040043f0000000003310436000000030400036700000001060000310000001f0560018f00000005066002720000033a0000613d000000000700001900000005087002100000000009830019000000000884034f000000000808043b00000000008904350000000107700039000000000867004b000003320000413d000000000705004b000003490000613d0000000506600210000000000464034f00000000036300190000000305500210000000000603043300000000065601cf000000000656022f000000000404043b0000010005500089000000000454022f00000000045401cf000000000464019f0000000000430435000000000202004b000003930000613d000000000001042d00000000010000190000041a000104300000010d0100004100000000001004350000004101000039000000040010043f0000010e010000410000041a00010430000000400100043d0000006402100039000001210300004100000000003204350000004402100039000001220300004100000000003204350000002402100039000000250300003900000000003204350000011b0200004100000000002104350000000402100039000000200300003900000000003204350000010702000041000001070310009c000000000102801900000040011002100000011e011001c70000041a00010430000000400100043d00000064021000390000011f0300004100000000003204350000004402100039000001200300004100000000003204350000002402100039000000300300003900000000003204350000011b0200004100000000002104350000000402100039000000200300003900000000003204350000010702000041000001070310009c000000000102801900000040011002100000011e011001c70000041a00010430000000400100043d00000064021000390000011c03000041000000000032043500000044021000390000011d0300004100000000003204350000002402100039000000260300003900000000003204350000011b0200004100000000002104350000000402100039000000200300003900000000003204350000010702000041000001070310009c000000000102801900000040011002100000011e011001c70000041a000104300000000021010434000000000301004b000004000000c13d000000400400043d000500000004001d0000011b01000041000000000014043500000004014000390000002002000039000000000021043500000003010000290000000003010433000400000003001d0000002401400039000000000031043500000044024000390000000101000029041801f60000040f00000004010000290000001f01100039000000200200008a000000000121016f00000044011000390000010702000041000001070310009c00000000010280190000000504000029000001070340009c000000000204401900000040022002100000006001100210000000000121019f0000041a00010430000000400200043d0000001f0430018f0000000503300272000003c10000613d000000000500001900000005065002100000000007620019000000000661034f000000000606043b00000000006704350000000105500039000000000635004b000003b90000413d000000000504004b000003d00000613d0000000503300210000000000131034f00000000033200190000000304400210000000000503043300000000054501cf000000000545022f000000000101043b0000010004400089000000000141022f00000000014101cf000000000151019f000000000013043500000107010000410000000103000031000001070430009c0000000003018019000001070420009c000000000102401900000040011002100000006002300210000000000112019f0000041a00010430000000400200043d0000001f0430018f0000000503300272000003e70000613d000000000500001900000005065002100000000007620019000000000661034f000000000606043b00000000006704350000000105500039000000000635004b000003df0000413d000000000504004b000003f60000613d0000000503300210000000000131034f00000000033200190000000304400210000000000503043300000000054501cf000000000545022f000000000101043b0000010004400089000000000141022f00000000014101cf000000000151019f000000000013043500000107010000410000000103000031000001070430009c0000000003018019000001070420009c000000000102401900000040011002100000006002300210000000000112019f0000041a000104300000010703000041000001070420009c0000000002038019000001070410009c000000000103801900000060011002100000004002200210000000000121019f0000041a000104300000040c002104210000000102000039000000000001042d0000000002000019000000000001042d00000411002104230000000102000039000000000001042d0000000002000019000000000001042d00000416002104250000000102000039000000000001042d0000000002000019000000000001042d0000041800000432000004190001042e0000041a00010430000000000000000000000000000000000000000000000000000000000000000000000000ffffffff8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000ffffffffffffffff000000000000000000000000000000000000000000000001000000000000000000000002000000000000000000000000000000400000010000000000000000004e487b71000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024000000000000000000000000a3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d505c60da1b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000008000000000000000001806aa1896bbf26568e884a7374b41e002500962caba6a15023a8d90e8508b8302000002000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000004000000000000000000000000ffffffffffffffffffffffff000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e000000000000000000000000000000000000000000000000ffffffffffffff9f206661696c656400000000000000000000000000000000000000000000000000416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c08c379a0000000000000000000000000000000000000000000000000000000006e74726163740000000000000000000000000000000000000000000000000000416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f000000000000000000000000000000000000008400000000000000000000000073206e6f74206120636f6e747261637400000000000000000000000000000000455243313936373a20626561636f6e20696d706c656d656e746174696f6e20697472616374000000000000000000000000000000000000000000000000000000455243313936373a206e657720626561636f6e206973206e6f74206120636f6e0000000000000000000000000000000000000000000000000000000000000000c71bdee3f38b4f53476c813def7356e8c71e2ecfb396e6c28dfe7c51f5900d0a";
            const tokenFactoryDepsHash = ethers.hexlify(utils.hashBytecode(tokenBytecode)); // "0x0100012539970918b0ab79e00660723a76fed0d6dac333c9298fdbb8628407f2";
            const result = await provider.getBytecodeByHash(tokenFactoryDepsHash);
            expect(result).to.be.deep.equal(Array.from(ethers.getBytes(tokenBytecode)));
        });
    });

    describe("#getRawBlockTransactions(number)", () => {
        it("should return bytecode of a contract", async () => {
            const blockNumber = await provider.getBlockNumber();
            const result = await provider.getRawBlockTransactions(blockNumber);
            expect(result).not.to.be.null;
        });
    });

    describe("#getTransactionStatus(txHash)", () => {
        it("should return transaction status", async () => {
            const result = await provider.getTransactionStatus(tx.hash);
            expect(result).not.to.be.null;
        });
    });

    describe("#getTransaction()", () => {
        it("should return transaction", async () => {
            const result = await provider.getTransaction(tx.hash);
            expect(result).not.to.be.null;
        });
    });

    describe("#getTransactionReceipt()", () => {
        it("should return transaction receipt", async () => {
            const result = await provider.getTransaction(tx.hash);
            expect(result).not.to.be.null;
        });
    });

    describe("#getDefaultBridgeAddresses()", () => {
        it("should return default bridges", async () => {
            const result = await provider.getDefaultBridgeAddresses();
            expect(result).not.to.be.null;
        });
    });

    describe("#newBlockFilter()", () => {
        it("should return new block filter", async () => {
            const result = await provider.newBlockFilter();
            expect(result).not.to.be.null;
        });
    });

    describe("#newPendingTransactionsFilter()", () => {
        it("should return new pending block filter", async () => {
            const result = await provider.newPendingTransactionsFilter();
            expect(result).not.to.be.null;
        });
    });

    describe("#newFilter()", () => {
        it("should return new filter", async () => {
            const result = await provider.newFilter({
                fromBlock: 0,
                toBlock: 5,
                address: utils.L2_ETH_TOKEN_ADDRESS,
            });
            expect(result).not.to.be.null;
        });
    });

    describe("#getContractAccountInfo()", () => {
        it("should return contract account info", async () => {
            const TESTNET_PAYMASTER = "0x0f9acdb01827403765458b4685de6d9007580d15";
            const result = await provider.getContractAccountInfo(TESTNET_PAYMASTER);
            expect(result).not.to.be.null;
        });
    });

    describe("#l2TokenAddress()", () => {
        it("should return L2 token address", async () => {
            const result = await provider.l2TokenAddress(utils.ETH_ADDRESS);
            expect(result).to.be.equal(utils.ETH_ADDRESS);
        });
    });

    describe("#l1TokenAddress()", () => {
        it("should return L1 token address", async () => {
            const result = await provider.l1TokenAddress(utils.ETH_ADDRESS);
            expect(result).to.be.equal(utils.ETH_ADDRESS);
        });
    });

    describe("#getBlock()", () => {
        it("should return block with transactions", async () => {
            const result = await provider.getBlock("latest", true);
            expect(result).not.to.be.null;
        });
    });

    describe("#getBlockDetails()", () => {
        it("should return block with transactions", async () => {
            const result = await provider.getBlockDetails(await provider.getBlockNumber());
            expect(result).not.to.be.null;
        });
    });

    describe("#getL1BatchBlockRange()", () => {
        it("should return L1 batch block range", async () => {
            const l1BatchNumber = await provider.getL1BatchNumber();
            const result = await provider.getL1BatchBlockRange(l1BatchNumber);
            expect(result).not.to.be.null;
        });
    });

    describe("#getL1BatchDetails()", () => {
        it("should return L1 batch details", async () => {
            const l1BatchNumber = await provider.getL1BatchNumber();
            const result = await provider.getL1BatchDetails(l1BatchNumber);
            expect(result).not.to.be.null;
        });
    });

    describe("#getLogs(filter)", () => {
        it("should return logs", async () => {
            const result = await provider.getLogs({
                fromBlock: 0,
                toBlock: 5,
                address: utils.L2_ETH_TOKEN_ADDRESS,
            });
            expect(result).not.to.be.null;
        });
    });

    describe("#getWithdrawTx(tx)", () => {
        it("return withdraw transaction", async () => {
            const WITHDRAW_TX = {
                from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
                value: BigInt(7_000_000_000),
                to: "0x000000000000000000000000000000000000800a",
                data: "0x51cff8d900000000000000000000000036615cf349d7f6344891b1e7ca7c72883f5dc049",
            };
            const result = await provider.getWithdrawTx({
                token: utils.ETH_ADDRESS,
                amount: 7_000_000_000,
                to: ADDRESS,
                from: ADDRESS,
            });
            expect(result).to.be.deep.equal(WITHDRAW_TX);
        });
    });

    describe("#getTransferTx()", () => {
        it("should return transfer transaction", async () => {
            const TRANSFER_TX = {
                from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
                to: RECEIVER,
                value: 7_000_000_000,
            };
            const result = await provider.getTransferTx({
                token: utils.ETH_ADDRESS,
                amount: 7_000_000_000,
                to: RECEIVER,
                from: ADDRESS,
            });
            expect(result).to.be.deep.equal(TRANSFER_TX);
        });
    });

    describe("#estimateGasWithdraw()", () => {
        it("should return gas estimation of withdraw transaction", async () => {
            const result = await provider.estimateGasWithdraw({
                token: utils.ETH_ADDRESS,
                amount: 7_000_000_000,
                to: ADDRESS,
                from: ADDRESS,
            });
            expect(result > 0).to.be.true;
        });
    });

    describe("#estimateGasTransfer()", () => {
        it("should return gas estimation of transfer transaction", async () => {
            const result = await provider.estimateGasTransfer({
                token: utils.ETH_ADDRESS,
                amount: 7_000_000_000,
                to: RECEIVER,
                from: ADDRESS,
            });
            expect(result > 0).to.be.be.true;
        });
    });

    describe("#estimateGasL1()", () => {
        it("should return gas estimation of L1 transaction", async () => {
            const result = await provider.estimateGasL1({
                from: ADDRESS,
                to: await provider.getMainContractAddress(),
                value: 7_000_000_000,
                customData: {
                    gasPerPubdata: 800,
                },
            });
            expect(result > 0).to.be.true;
        });
    });

    describe("#estimateL1ToL2Execute()", () => {
        it("should return gas estimation of L1 to L2 transaction", async () => {
            const result = await provider.estimateL1ToL2Execute({
                contractAddress: await provider.getMainContractAddress(),
                calldata: "0x",
                caller: ADDRESS,
                l2Value: 7_000_000_000,
            });
            expect(result > 0).to.be.true;
        });
    });

    describe("#estimateFee()", () => {
        it("should return gas estimation of transaction", async () => {
            const result = await provider.estimateFee({
                from: ADDRESS,
                to: RECEIVER,
                value: `0x${BigInt(7_000_000_000).toString(16)}`,
            });
            expect(result).not.to.be.null;
        });
    });

    describe("#estimateGas()", () => {
        it("should return gas estimation of transaction", async () => {
            const result = await provider.estimateGas({
                from: ADDRESS,
                to: await provider.l2TokenAddress(DAI.l1Address),
                data: utils.IERC20.encodeFunctionData("approve", [RECEIVER, 1]),
            });
            expect(result > 0).to.be.true;
        });

        // it("should return gas estimation of EIP712 transaction", async () => {
        //     // const tokenApprove = await provider.estimateGas({
        //     //     from: PUBLIC_KEY,
        //     //     to: tokenAddress,
        //     //     data: utils.IERC20.encodeFunctionData("approve", [RECEIVER, 1]),
        //     //     customData: {
        //     //         gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        //     //         paymasterParams,
        //     //     }
        //     // });
        //     // console.log(`Gas token approval (EIP-712): ${tokenApprove}`);
        //
        //     const result = await provider.estimateFee({
        //         from: ADDRESS,
        //         to: RECEIVER,
        //         value: `0x${BigInt(7_000_000_000).toString(16)}`,
        //     });
        //     expect(result).not.to.be.null;
        // });
    });

    describe("#getFilterChanges()", () => {
        it("should return filtered logs", async () => {
            const filter = await provider.newFilter({
                address: utils.L2_ETH_TOKEN_ADDRESS,
                topics: [ethers.id("Transfer(address,address,uint256)")],
            });
            const result = await provider.getFilterChanges(filter);
            expect(result).not.to.be.null;
        });
    });
});