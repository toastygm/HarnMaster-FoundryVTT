/* eslint-disable no-unused-vars */
import * as hm from "./hm-common.js";

/* ====================================================================== */
/*          Constants                                                     */
/* ====================================================================== */

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
const fields = foundry.data.fields;

const ISLE = {
    CONST: {},
    CONFIG: {},
};

const IsleActorDataModels = foundry.utils.mergeObject(
    hm.SohlActorDataModels,
    {},
    { inplace: false },
);

const IsleItemDataModels = foundry.utils.mergeObject(
    hm.SohlItemDataModels,
    {},
    { inplace: false },
);

const IsleModifiers = foundry.utils.mergeObject(
    hm.SohlModifiers,
    {},
    { inplace: false },
);

export const verData = {
    id: "island",
    label: "HarnMaster: Island Edition",
    CONFIG: {
        Helper: {
            modifiers: IsleModifiers,
            contextMenu: hm.SohlContextMenu,
        },
        Actor: {
            documentClass: hm.SohlActor,
            documentSheets: [
                {
                    cls: hm.SohlActorSheet,
                    types: Object.keys(IsleActorDataModels),
                },
            ],
            dataModels: IsleActorDataModels,
            typeLabels: hm.SohlActorTypeLabels,
            typeIcons: hm.SohlActorTypeIcons,
            types: Object.keys(IsleActorDataModels),
            defaultType: hm.AnimateEntityActorData.typeName,
            compendiums: [],
        },
        Item: {
            documentClass: hm.SohlItem,
            documentSheets: [
                {
                    cls: hm.SohlItemSheet,
                    types: Object.keys(IsleItemDataModels).filter(
                        (t) => t !== hm.ContainerGearItemData.typeName,
                    ),
                },
                {
                    cls: hm.SohlContainerGearItemSheet,
                    types: [hm.ContainerGearItemData.typeName],
                },
            ],
            dataModels: IsleItemDataModels,
            typeLabels: hm.SohlItemTypeLabels,
            typeIcons: hm.SohlItemTypeIcons,
            types: Object.keys(IsleItemDataModels),
            compendiums: ["hm.island-basic-items"],
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
    CONST: foundry.utils.mergeObject(hm.HM.CONST, ISLE.CONST, {
        inplace: false,
    }),
};
