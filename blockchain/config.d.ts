declare namespace _default {
    let contractAddress: string;
    let network: string;
    let chainId: number;
    let deployer: string;
    let deployedAt: string;
    let blockNumber: number;
    let abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    } | {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
    })[];
}
export default _default;
//# sourceMappingURL=config.d.ts.map