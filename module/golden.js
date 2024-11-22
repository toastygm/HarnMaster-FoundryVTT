/* eslint-disable no-unused-vars */
import * as hm from "./hm-common.js";

/* ====================================================================== */
/*          Constants                                                     */
/* ====================================================================== */

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
const fields = foundry.data.fields;

const GOLD = {
    CONST: {},
    CONFIG: {},
};

const GoldActorDataModels = foundry.utils.mergeObject(
    hm.SohlActorDataModels,
    {},
    { inplace: false },
);

const GoldItemDataModels = foundry.utils.mergeObject(
    hm.SohlItemDataModels,
    {},
    { inplace: false },
);

const GoldModifiers = foundry.utils.mergeObject(
    hm.SohlModifiers,
    {},
    { inplace: false },
);

export const verData = {
    id: "gold",
    label: "HarnMaster: Gold Edition",
    CONFIG: {
        Helper: {
            modifiers: GoldModifiers,
            contextMenu: hm.SohlContextMenu,
        },
        Actor: {
            documentClass: hm.SohlActor,
            documentSheets: [
                {
                    cls: hm.SohlActorSheet,
                    types: Object.keys(GoldActorDataModels),
                },
            ],
            dataModels: GoldActorDataModels,
            typeLabels: hm.SohlActorTypeLabels,
            typeIcons: hm.SohlActorTypeIcons,
            types: Object.keys(GoldActorDataModels),
            defaultType: hm.AnimateEntityActorData.typeName,
            compendiums: [],
        },
        Item: {
            documentClass: hm.SohlItem,
            documentSheets: [
                {
                    cls: hm.SohlItemSheet,
                    types: Object.keys(GoldItemDataModels).filter(
                        (t) => t !== hm.ContainerGearItemData.typeName,
                    ),
                },
                {
                    cls: hm.SohlContainerGearItemSheet,
                    types: [hm.ContainerGearItemData.typeName],
                },
            ],
            dataModels: GoldItemDataModels,
            typeLabels: hm.SohlItemTypeLabels,
            typeIcons: hm.SohlItemTypeIcons,
            types: Object.keys(GoldItemDataModels),
            compendiums: ["hm.golden-basic-items"],
        },
        ActiveEffect: {
            documentClass: hm.SohlActiveEffect,
            legacyTransferral: false,
        },
        Macro: {
            documentClass: hm.SohlMacro,
            documentSheet: hm.SohlMacroConfig,
        },
    },
    CONST: foundry.utils.mergeObject(hm.HM.CONST, GOLD.CONST, {
        inplace: false,
    }),
};
