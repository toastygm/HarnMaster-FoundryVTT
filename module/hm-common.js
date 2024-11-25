/* eslint-disable no-unused-vars */
/*===============================================================*/
/*      HM Common Classes                                        */
/*===============================================================*/
/**
 * The fields property is a shortcut for foundry FieldData definitions
 *
 * @type {object}
 */
const fields = foundry.data.fields;

/**
 * Base HM object containing various properties, constants, and configuration
 * parameters related to the HM system,
 */
export const HM = {
    ready: false,
    hasSimpleCalendar: false,
    versionsData: {},
    defaultVersion: "kethira",
    sysVer: {},
    registerSystemVersion: function (verId, verData) {
        HM.versionsData[verId] = verData;
    },
    statusEffects: [
        {
            id: "incapacitated",
            name: "incapacitated",
            img: "systems/hm/assets/icons/knockout.svg",
        },
        {
            id: "vanquished",
            name: "vanquished",
            img: "systems/hm/assets/icons/surrender.svg",
        },
    ],

    specialStatusEffects: {
        DEFEATED: "vanquished",
    },

    controlIcons: {
        defeated: "systems/hm/assets/icons/surrender.svg",
    },

    CONST: {
        // ASCII Artwork (Doom font)
        hmInitMessage: `Initializing the HârnMaster Game System
===========================================================
 _   _   __            ___  ___          _
| | | | //\\\\           |  \\/  |         | |
| |_| | __ _ _ __ _ __ | .  . | __ _ ___| |_ ___ _ __
|  _  |/ _\` | '__| '_ \\| |\\/| |/ _\` / __| __/ _ \\ '__|
| | | | (_| | |  | | | | |  | | (_| \\__ \\ ||  __/ |
\\_| |_/\\__,_|_|  |_| |_\\_|  |_/\\__,_|___/\\__\\___|_|
===========================================================`,

        /** @enum */
        CHARS: {
            TIMES: "\u00D7",
            GREATERTHANOREQUAL: "\u2265",
            LESSTHANOREQUAL: "\u2264",
            INFINITY: "\u221E",
            STARF: "\u2605",
            STAR: "\u2606",
        },

        SUCCESS_VALUE_TABLE: [
            {
                maxValue: 0,
                result: 0,
                limited: [],
                success: false,
                label: "No Value",
                description: "Test fails to produce a usable result",
            },
            {
                maxValue: 2,
                result: 0,
                limited: [],
                success: false,
                label: "Little Value",
                description: "Test produces a limited or flawed result",
            },
            {
                maxValue: 4,
                result: 0,
                limited: [],
                success: true,
                label: "Base Value",
                description: "Test produces an average result",
            },
            {
                maxValue: 8,
                result: (chatData) => chatData.successValue - 4,
                limited: [],
                success: true,
                label: (chatData) =>
                    "\u2605".repeat(chatData.successValue - 4) + " Bonus Value",
                description: "Test produces a superior result",
            },
            {
                maxValue: 999,
                result: 5,
                limited: [],
                success: true,
                label: "\u2605".repeat(5) + " Bonus Value",
                description: "Test produces a superior result",
            },
        ],

        /** @enum */
        SUCCESS_LEVEL: {
            CriticalFailure: -1,
            MarginalFailure: 0,
            MarginalSuccess: 1,
            CriticalSuccess: 2,
        },

        /** @enum */
        SHOCK: {
            None: 0,
            Stunned: 1,
            Incapacitated: 2,
            Unconscious: 3,
            Killed: 4,
        },

        SETTINGS: {
            systemMigrationVersion: {
                key: "systemMigrationVersion",
            },
            hmVersion: {
                key: "hmVersion",
            },
            showWelcomeDialog: {
                key: "showWelcomeDialog",
                data: {
                    name: "Show welcome dialog on start",
                    hint: "Display the welcome dialog box when the user logs in.",
                    scope: "client",
                    config: true,
                    type: new fields.BooleanField({ initial: true }),
                },
            },
            combatAudio: {
                key: "combatAudio",
                data: {
                    name: "Combat sounds",
                    hint: "Enable combat flavor sounds",
                    scope: "world",
                    config: true,
                    type: new fields.BooleanField({ initial: true }),
                },
            },
            defaultAnimateEntity: {
                key: "defaultAnimateEntity",
                data: {
                    name: "Default Animate Entity",
                    hint: "Name of default actor to use for new Animate Entities",
                    scope: "world",
                    config: true,
                    type: new fields.StringField({
                        nullable: false,
                        blank: false,
                        initial: "Folk, Basic",
                    }),
                },
            },
            searchActorCompendiums: {
                key: "searchActorCompendiums",
                data: {
                    name: "Additional Actor Compendiums",
                    hint:
                        "A comma-separated list of compendium IDs that should be used " +
                        "when searching for Actors. Local world actors first, then these " +
                        "compendiums will be searched, and finally system-specified compendiums.",
                    scope: "world",
                    config: true,
                    type: new fields.StringField({
                        nullable: false,
                        initial: "",
                    }),
                },
            },
            searchItemCompendiums: {
                key: "searchItemCompendiums",
                data: {
                    name: "Additional Item Compendiums",
                    hint:
                        "A comma-separated list of compendium IDs that should be used " +
                        "when searching for Items. Local world items first, then these " +
                        "compendiums will be searched, and finally system-specified compendiums.",
                    scope: "world",
                    config: true,
                    type: new fields.StringField({
                        nullable: false,
                        initial: "",
                    }),
                },
            },
            recordInjuries: {
                key: "recordInjuries",
                data: {
                    name: "Record injuries automatically on actor sheet",
                    hint: "Automatically add injuries to actor sheet",
                    scope: "world",
                    config: true,
                    default: "enable",
                    type: new fields.StringField({
                        nullable: false,
                        blank: false,
                        initial: "enable",
                        choices: {
                            enable: "Record injuries automatically",
                            disable: "Don't record injuries automatically",
                            ask: "Prompt user on each injury",
                        },
                    }),
                },
            },
            healingSeconds: {
                key: "healingSeconds",
                data: {
                    name: "Seconds between healing checks",
                    hint: "Number of seconds between healing checks. Set to 0 to disable.",
                    scope: "world",
                    config: true,
                    type: new fields.NumberField({
                        required: true,
                        nullable: false,
                        initial: 432000, // 5 days
                    }),
                },
            },
            optionProjectileTracking: {
                key: "optionProjectileTracking",
                data: {
                    name: "Track Projectile/Missile Quantity",
                    hint: "Reduce projectile/missile quantity when used; disallow missile attack when quantity is zero",
                    scope: "world",
                    config: true,
                    type: new fields.BooleanField({ initial: false }),
                },
            },
            optionFate: {
                key: "optionFate",
                data: {
                    name: "Use fate rules",
                    scope: "world",
                    config: true,
                    type: new fields.BooleanField({ initial: true }),
                },
            },
        },
    },
};

/**
 * A class representing a value and associated modifications. It includes methods
 * to set and get properties, add named modifiers to the data, and determine
 * effective value.
 *
 * @export
 * @class ValueModifier
 * @typedef {ValueModifier}
 */
export class ValueModifier {
    static _reserved_words;
    _mods;
    _effective;
    _abbrev;
    _parent;
    _properties;
    _disabled;
    _dirty;
    _base;

    constructor(parent, initProperties = {}) {
        if (parent instanceof SohlBaseData) {
            this._parent = parent;
        } else {
            throw new Error("parent must be a subclass of SohlBaseData");
        }

        this.reset();
        this._properties = new Collection();
        this._disabled = false;
        this._dirty = true;
        Object.keys(initProperties).forEach((p) => {
            this.setProperty(p, initProperties[p]);
        });
    }

    static get vmName() {
        return "ValueModifier";
    }

    static get reservedWords() {
        if (!this._reserved_words) {
            this._reserved_words = Object.getOwnPropertyNames(this.prototype);
        }
        return this._reserved_words;
    }

    get parent() {
        return this._parent;
    }

    get effective() {
        if (this._disabled) return 0;

        this._apply();
        return this._effective;
    }

    get modifier() {
        if (this._disabled) return 0;

        return this.effective - (this.base || 0);
    }

    get base() {
        if (this._disabled) return undefined;

        this._apply();
        return this._base;
    }

    get abbrev() {
        if (this._disabled) return "";

        this._apply();
        return this._abbrev;
    }

    get index() {
        return Math.trunc(this.effective / 10);
    }

    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = !!value;
    }

    test() {
        if (this.disabled) {
            return null;
        }
    }

    getProperty(name) {
        if (!this._properties.has(name)) {
            return undefined;
        }

        const val = this._properties.get(name);
        if (val instanceof Function) {
            this._apply();
            return val(this);
        }

        return val;
    }

    /**
     * Sets the named property to the provided value.  If the name is not currently a property
     * of this ValueModifier, then it adds a getter and setter to this ValueModifier for
     * ease of access and setting of the property value.
     *
     * @param {string} name Name of property to set to value
     * @param {*} newValue New value of the property
     * @returns {ValueModifier} the base ValueModifier
     */
    setProperty(name, newValue) {
        if (!this._properties.has(name)) {
            if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
                throw new Error(`Name "${name}" is not a valid identifier`);
            }

            if (this.constructor.reservedWords.includes(name)) {
                throw new Error(`Cannot set property of reserved key ${name}`);
            }

            const config = {
                get() {
                    return this.getProperty(name);
                },
                set(v) {
                    this.setProperty(name, v);
                },
                enumerable: false,
                configurable: false,
            };

            if (this.name) {
                delete config.get;
            }

            if (newValue instanceof Function) {
                delete config.set;
            }

            if (this.get || this.set) {
                Object.defineProperty(this, name, config);
            }
        }

        if (this._properties.get(name) instanceof Function) {
            throw new Error(
                `Attempt to modify an unmodifiable property "${name}"`,
            );
        } else {
            const curVal = this._properties.get(name);
            const type = typeof curVal;
            if (
                !["undefined", "null"].includes(type) &&
                // biome-ignore lint/suspicious/useValidTypeof: This is a bogus error, the logic is fine
                typeof newValue !== type
            ) {
                throw new Error("types do not match");
            }
            this._properties.set(name, newValue);
            this._dirty = true;
            return this;
        }
    }

    hasProperty(name) {
        return this._properties.has(name);
    }

    /**
     * Sets the base value to the provided value, replacing any existing base value.
     * @param {number} value New value to add
     * @returns {ValueModifier} the base ValueModifier
     */
    setBase(value) {
        // Delete any existing mod base
        for (let idx = this._mods.length - 1; idx >= 0; idx--) {
            if (this._mods[idx].name === SohlBaseData.mods.Base.name)
                this._mods.splice(idx, 1);
        }

        const type = typeof value;
        if (type === "number") {
            // Add new mod base to the beginning of the mods array
            this._mods.unshift({
                name: SohlBaseData.mods.Base.name,
                abbrev: SohlBaseData.mods.Base.abbrev,
                op: CONST.ACTIVE_EFFECT_MODES.ADD,
                value: ValueModifier._cleanNumber(value),
            });
        } else if (value !== null && type !== "undefined") {
            throw new Error(`value "${value}" must be a number`);
        }

        this._dirty = true;
        return this;
    }

    /**
     * Modifies the base by adding the provided value.
     *
     * @param {number} value Value to add to the current base value
     * @returns {ValueModifier} the base ValueModifier
     */
    addToBase(value) {
        if (value !== null) {
            const type = typeof value;
            if (type === "undefined") {
                return this;
            } else if (type === "number") {
                this._apply();
                this.setBase((this.base || 0) + value);
            } else {
                throw new Error(`value "${value}" must be a number`);
            }
        }
        return this;
    }

    reset() {
        this._abbrev = null;
        this._mods = [];
        this._disabled = false;
        this._properties?.keys().forEach((k) => {
            const type = typeof this._properties[k];
            switch (type) {
                case "number":
                    this._properties.set(k, 0);
                    break;

                case "string":
                    this._properties.set(k, "");
                    break;

                case "boolean":
                    this._properties.set(k, false);
                    break;
            }
        });
        this._dirty = true;
        return this;
    }

    /**
     * Adds the modifiers (and optionally the base value as well) from a source ValueModifier to this one.
     *
     * @param {ValueModifier} sourceVM An existing ValueModifier to add to the current one
     * @param {object} [options={}]
     * @param {boolean} [options.includeBase=false] Whether to include adding the base value; otherwise, just the modifications will be added
     * @returns {ValueModifier} the base ValueModifier
     */
    addVM(sourceVM, { includeBase = false } = {}) {
        if (!(sourceVM instanceof ValueModifier)) {
            throw new Error(`not a ValueModifier`);
        }

        let newBase;
        for (let mod of sourceVM._mods) {
            if (mod.name !== SohlBaseData.mods.Base.name) {
                this._mods.push(foundry.utils.deepClone(mod));
            } else {
                newBase = mod.value;
            }
        }
        if (includeBase && typeof newBase === "number") this.setBase(newBase);

        this._dirty = true;
        return this;
    }

    _oper(name, abbrev, value, op) {
        const existingOverride = this._mods.find(
            (m) => m.op === CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        );
        if (existingOverride) {
            // If the operation is not override, then ignore it (leave current override in place)
            if (op === CONST.ACTIVE_EFFECT_MODES.OVERRIDE) {
                // If this ValueModifier already been overriden to zero, all other modifications are ignored.
                if (existingOverride.value !== 0) {
                    // If this ValueModifier is being overriden, throw out all other modifications
                    this._mods = [];
                }
            }
        } else {
            this._mods.push({
                name: name,
                abbrev: abbrev,
                op: op,
                value: ValueModifier._cleanNumber(value),
            });
            this._dirty = true;
        }

        return this;
    }

    add(name, abbrev, value) {
        return this._oper(name, abbrev, value, CONST.ACTIVE_EFFECT_MODES.ADD);
    }

    multiply(name, abbrev, value) {
        return this._oper(
            name,
            abbrev,
            value,
            CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
        );
    }

    set(name, abbrev, value) {
        return this._oper(
            name,
            abbrev,
            value,
            CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        );
    }

    floor(name, abbrev, value) {
        return this._oper(
            name,
            abbrev,
            value,
            CONST.ACTIVE_EFFECT_MODES.UPGRADE,
        );
    }

    ceiling(name, abbrev, value) {
        return this._oper(
            name,
            abbrev,
            value,
            CONST.ACTIVE_EFFECT_MODES.DOWNGRADE,
        );
    }

    /**
     * This is a relatively expensive operation, so it is preferred to use
     * ValueModifier#getProperty or the getters instead unless these properties
     * need to be accessed as an object.
     *
     * This method differs from ValueModifier#toObject, since the returned
     * object does not have the private information needed to recreate the
     * ValueModifier, and the properties are nomalized to be at the outer level
     * of the object.
     */
    get props() {
        const result = {
            base: this.base,
            effective: this.effective,
            abbrev: this.abbrev,
            modifier: this.modifier,
        };
        for (let k of this._properties.keys()) {
            result[k] = this.getProperty(k);
        }
        return result;
    }

    toObject() {
        const propKeys = Array.from(this._properties.keys());
        return {
            vmName: this.constructor.vmName,
            mods: foundry.utils.deepClone(this._mods),
            properties: propKeys.reduce((obj, k) => {
                let prop = this.getProperty(k);
                prop = prop instanceof ValueModifier ? prop.toObject() : prop;
                obj[k] = prop;
                return obj;
            }, {}),
        };
    }

    static fromObject(obj, parent) {
        if (!obj || typeof obj !== "object" || obj.vmName !== this.vmName)
            return obj;
        if (!(parent instanceof SohlItemData)) {
            throw new Error("parent must be a subclass of SohlItemData");
        }
        const props = Object.entries(obj.properties).reduce(
            (acc, [key, val]) => {
                let prop =
                    typeof val === "object"
                        ? this.fromObject(val, parent)
                        : val;
                acc[key] = prop;
                return acc;
            },
            {},
        );
        const vm = new this(parent, props);
        let newBase;
        for (let mod of obj.mods) {
            if (mod.name !== SohlBaseData.mods.Base.name) {
                vm._mods.push(mod);
            } else {
                newBase = mod.value;
            }
            if (newBase !== undefined) {
                vm.setBase(newBase);
            }
        }
        return vm;
    }

    static fromJSON(json, parent) {
        const result = this.fromObject(JSON.parse(json), parent);
        if (!(result instanceof ValueModifier)) {
            throw new Error("Not a ValueModifier");
        }
        return result;
    }

    toJSON() {
        return this.toObject();
    }

    get chatHtml() {
        let html = `<div class="adjustment">
        <div class="flexrow">
            <span class="label adj-name">Adjustment</span>
            <span class="label adj-value">Value</span>    
        </div>`;
        this._mods.forEach((m) => {
            html += `<div class="flexrow">
            <span class="adj-name">${m.name}</span>
            <span class="adj-value">`;
            switch (m.op) {
                case CONST.ACTIVE_EFFECT_MODES.ADD:
                    html += `${m.value >= 0 ? "+" : ""}${m.value}`;
                    break;

                case CONST.ACTIVE_EFFECT_MODES.MULTIPLY:
                    html += `${HM.CONST.CHARS.TIMES}${m.value}`;
                    break;

                case CONST.ACTIVE_EFFECT_MODES.DOWNGRADE:
                    html += `${HM.CONST.CHARS.LESSTHANOREQUAL}${m.value}`;
                    break;

                case CONST.ACTIVE_EFFECT_MODES.UPGRADE:
                    html += `${HM.CONST.CHARS.GREATERTHANOREQUAL}${m.value}`;
                    break;

                case CONST.ACTIVE_EFFECT_MODES.OVERRIDE:
                    html += `=${m.value}`;
                    break;

                case CONST.ACTIVE_EFFECT_MODES.CUSTOM:
                    html += `${HM.CONST.CHARS.STAR}${m.value}`;
                    break;

                default:
                    throw Error(
                        `SoHL | Specified mode "${m.op}" not recognized while processing ${m.abbrev}`,
                    );
            }
            html += `</span></div>`;
        });
        html += "</div>";
        return html;
    }

    /**
     * Creates a new ValueModifier from a source ValueModifier and a parent DataModel.
     *
     * @static
     * @param {ValueModifier|string} [sourceVM=null] a ValueModifier object or a JSON serialized ValueModifier
     * @param {object} [options={}]
     * @param {DataModel} [options.parent=null] The parent DataModel of the new ValueModifier.
     * @returns {ValueModifier}
     */
    static create(sourceVM = null, { parent = null } = {}) {
        if (!parent) {
            if (!(sourceVM instanceof ValueModifier)) {
                throw new Error("Must supply parent");
            } else {
                parent = sourceVM.parent;
            }
        }

        if (sourceVM instanceof ValueModifier) {
            sourceVM = JSON.stringify(sourceVM.toJSON());
        }

        if (typeof sourceVM === "string") {
            try {
                sourceVM = this.fromJSON(sourceVM, parent);
            } catch (error) {
                Hooks.onError("ValueModifier#create", error, {
                    msg: "Invalid JSON serialized string",
                    log: "error",
                });
            }
        } else {
            throw new Error(
                `Must be ValueModifier or a JSON serialized ValueModifier`,
            );
        }

        const props = IterWrap.create(sourceVM._properties.entries()).reduce(
            (obj, [key, value]) => {
                obj[key] = value;
                return obj;
            },
            {},
        );
        let result = new this(parent, props);
        if (!result) throw new Error(`Not a valid ValueModifier`);
        result._mods = sourceVM._mods;

        return result;
    }

    _calcAbbrev() {
        this._abbrev = "";
        this._mods.forEach((adj) => {
            if (this._abbrev) {
                this._abbrev += ", ";
            }

            switch (adj.op) {
                case CONST.ACTIVE_EFFECT_MODES.ADD:
                    this._abbrev += `${adj.abbrev} ${adj.value > 0 ? "+" : ""}${
                        adj.value
                    }`;
                    break;

                case CONST.ACTIVE_EFFECT_MODES.MULTIPLY:
                    this._abbrev += `${adj.abbrev} ${HM.CONST.CHARS.TIMES}${adj.value}`;
                    break;

                case CONST.ACTIVE_EFFECT_MODES.DOWNGRADE:
                    this._abbrev += `${adj.abbrev} ${HM.CONST.CHARS.LESSTHANOREQUAL}${adj.value}`;
                    break;

                case CONST.ACTIVE_EFFECT_MODES.UPGRADE:
                    this._abbrev += `${adj.abbrev} ${HM.CONST.CHARS.GREATERTHANOREQUAL}${adj.value}`;
                    break;

                case CONST.ACTIVE_EFFECT_MODES.OVERRIDE:
                    this._abbrev += `${adj.abbrev} =${adj.value}`;
                    break;

                case CONST.ACTIVE_EFFECT_MODES.CUSTOM:
                    this._abbrev += `${adj.abbrev}`;
                    break;
            }
        });
    }

    static _cleanNumber(value) {
        return Number.parseFloat(value) || 0;
    }

    _apply() {
        if (!this._dirty) return;

        // Sort modifiers so that we process Adds first, then Mults, then Floor, then Ceil
        this._mods.sort((a, b) => (a.op < b.op ? -1 : a.op > b.op ? 1 : 0));

        let minVal = null;
        let maxVal = null;
        let overrideVal = null;

        this._effective = 0;

        // Process each modifier
        this._mods.forEach((adj) => {
            let value = ValueModifier._cleanNumber(adj.value);

            if (typeof value === "number") {
                value ||= 0;
                switch (adj.op) {
                    case CONST.ACTIVE_EFFECT_MODES.ADD:
                        this._effective += value;
                        break;

                    case CONST.ACTIVE_EFFECT_MODES.MULTIPLY:
                        this._effective *= value;
                        break;

                    case CONST.ACTIVE_EFFECT_MODES.UPGRADE:
                        // set minVal to the largest minimum value
                        minVal = Math.max(
                            minVal ?? Number.MIN_SAFE_INTEGER,
                            value,
                        );
                        break;

                    case CONST.ACTIVE_EFFECT_MODES.DOWNGRADE:
                        // set maxVal to the smallest maximum value
                        maxVal = Math.min(
                            maxVal ?? Number.MAX_SAFE_INTEGER,
                            value,
                        );
                        break;

                    case CONST.ACTIVE_EFFECT_MODES.OVERRIDE:
                        overrideVal = value;
                        break;
                }
            } else if (typeof value === "boolean") {
                switch (adj.op) {
                    case CONST.ACTIVE_EFFECT_MODES.ADD:
                        this._effective ||= value ? 1 : 0;
                        break;

                    case CONST.ACTIVE_EFFECT_MODES.MULTIPLY:
                        this._effective = value && this._effective ? 1 : 0;
                        break;

                    case CONST.ACTIVE_EFFECT_MODES.UPGRADE:
                        // set minVal to the largest minimum value
                        minVal = 0;
                        break;

                    case CONST.ACTIVE_EFFECT_MODES.DOWNGRADE:
                        // set maxVal to the smallest maximum value
                        maxVal = 1;
                        break;

                    case CONST.ACTIVE_EFFECT_MODES.OVERRIDE:
                        overrideVal = value ? 1 : 0;
                        break;
                }
            }
        });

        this._effective =
            minVal === null
                ? this._effective
                : Math.max(minVal, this._effective);
        this._effective =
            maxVal === null
                ? this._effective
                : Math.min(maxVal, this._effective);
        this._effective = overrideVal ?? this._effective;
        this._effective ||= 0;

        // All values must be rounded to no more than 3 significant digits.
        this._effective = Utility.maxPrecision(this._effective, 3);

        this._calcAbbrev();
        const baseAdj = this._mods.find(
            (adj) =>
                adj.abbrev === SohlBaseData.mods.Base.abbrev &&
                adj.op === CONST.ACTIVE_EFFECT_MODES.ADD,
        );
        this._base = baseAdj ? baseAdj.value : undefined;
        this._dirty = false;
    }

    /**
     * Checks if the provided value is a valid array item by ensuring that it is an object with specific properties: 'name' as a string, 'abbr' as a string, 'op' as a number, and 'value' as a number. Returns true if the conditions are met, otherwise returns false.
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     */
    static _arrayItemValid(value) {
        if (typeof value === "object") {
            if (
                typeof value.name === "string" &&
                typeof value.abbrev === "string" &&
                typeof value.op === "number" &&
                typeof value.value === "number"
            )
                return true;
        }
        return false;
    }
}

/**
 * Specialized ValueModifier for Impacts
 */
export class ImpactModifier extends ValueModifier {
    get disabled() {
        let disabled =
            this._disabled || (this.die === 0 && this.effective === 0);
        return disabled;
    }

    static get aspectTypes() {
        return {
            blunt: "Blunt",
            edged: "Edged",
            piercing: "Piercing",
            fire: "Fire",
        };
    }

    constructor(
        parent,
        { aspect = "blunt", die = 6, numDice = 1, ...initProperties } = {},
    ) {
        super(
            parent,
            foundry.utils.mergeObject(
                initProperties,
                {
                    aspect,
                    die,
                    numDice,
                    lastResult: null,
                },
                { inplace: false },
            ),
        );
    }

    static get vmName() {
        return "ImpactModifier";
    }

    get diceFormula() {
        if (!this.numDice && !this.effective) return "0";
        const result =
            (this.numDice
                ? `${this.numDice > 1 ? this.numDice : ""}d${this.die}${
                      this.effective >= 0 ? "+" : ""
                  }`
                : "") + this.effective;
        return result;
    }

    get label() {
        const aspectChar = this.aspect?.length
            ? this.aspect.charAt(0).toLowerCase()
            : "";
        return `${this.diceFormula}${aspectChar}`;
    }

    async evaluate() {
        const roll = await Roll.create(this.diceFormula).evaluate();
        this.setProperty("lastResultJson", roll.toJSON());
        return roll;
    }
}

export class MasteryLevelModifier extends ValueModifier {
    constructor(parent, initProperties = {}) {
        super(
            parent,
            foundry.utils.mergeObject(
                {
                    minTarget: 5,
                    maxTarget: 95,
                    successLevelMod: 0,
                    critFailureDigits: [5, 0],
                    critSuccessDigits: [5, 0],
                },
                initProperties,
                { inplace: false, recursive: false },
            ),
        );
    }

    static get vmName() {
        return "MasteryLevelModifier";
    }

    get disabled() {
        let disabled = super.disabled;
        disabled ||= this.base <= 0;
        return disabled;
    }

    set disabled(val) {
        super.disabled = val;
    }

    get constrainedEffective() {
        return Math.min(
            this.maxTarget,
            Math.max(this.minTarget, this.effective),
        );
    }

    /**
     * @typedef SuccessTestChatData
     * @property {boolean} askFate Whether a fate roll may be made against this test
     * @property {string} mlModJson JSON-encoded MasteryLevelModifier for this test
     * @property {string} rollJson JSON-encoded Roll for this test
     */

    /**
     * Perform a success test of the MasteryLevel.
     *
     * @param {object} options Configuration options for the roll
     * @param {boolean} [options.skipDialog=false] Do not display dialog box (use defaults)
     * @param {boolean} [options.noChat=false] Do not send any chat messages
     * @param {string} [options.type] Test identifier string
     * @param {label} [options.title] Human-readable short description
     * @returns {SuccessTestResult} Object containing results of the roll
     */
    async test({
        skipDialog = false,
        noChat = false,
        speaker,
        type = "",
        title = "",
    } = {}) {
        let mlMod = this.constructor.create(this, {
            parent: this.parent,
        });

        if (!skipDialog) {
            // Render modal dialog
            let dlgTemplate =
                "systems/hm/templates/dialog/standard-test-dialog.html";

            let dialogData = {
                type,
                title,
                target: mlMod.effective,
                base: mlMod.base,
                mods: mlMod.chatHtml,
                modifier: 0,
                askSuccessLevelMod: true,
                successLevelMod: mlMod.successLevelMod || 0,
            };
            const html = await renderTemplate(dlgTemplate, dialogData);

            // Create the dialog window
            mlMod = await Dialog.prompt({
                title: dialogData.title,
                content: html.trim(),
                label: "Roll",
                callback: (html) => {
                    const form = html.querySelector("form");
                    const fd = new FormDataExtended(form);
                    const formData = fd.object;

                    const formModifier = Number.parseInt(formData.modifier, 10);
                    if (formModifier) {
                        mlMod.add("Player Modifier", "PlyrMod", formModifier);
                    }

                    if (dialogData.askSuccessLevelMod) {
                        const formSuccessLevelMod = Number.parseInt(
                            formData.successLevelMod,
                            10,
                        );
                        mlMod.successLevelMod = formSuccessLevelMod;
                    }

                    return mlMod;
                },
                rejectClose: false,
                options: { jQuery: false },
            });

            if (!mlMod) return;
        }

        const roll = await new Roll("1d100").evaluate();
        if (!roll) {
            throw new Error(`Roll evaluation failed`);
        }

        const testResult = {
            speaker,
            askFate: this.parent.availableFate,
            mlModJson: JSON.stringify(mlMod.toJSON()),
            rollJson: JSON.stringify(roll.toJSON()),
            type,
            title,
        };

        if (!noChat) this.successTestToChat(testResult);
        return testResult;
    }

    /**
     * @typedef SuccessTestChatData
     * @property {string} type type name of test
     * @property {string} title Title of chat card to display
     * @property {number} origTarget The initial target (before modifiers)
     * @property {string} modHtml HTML fragment containing modifier explanations
     * @property {number} successLevel Final success level after all modifiers applied
     * @property {number} successLevelMod Modifier to success level
     * @property {number} effTarget Effective target after all modifiers applied
     * @property {boolean} isCapped Whether the target was capped
     * @property {boolean} isSuccess Whether the roll result was a success
     * @property {boolean} isCritical Whether the roll result was a critical
     * @property {string} rollJson JSON encoded string for the Roll object
     * @property {number} rollTotal The total value of the roll
     * @property {string} rollResultExpr An expression for the terms of the roll
     * @property {number} lastDigit
     * @property {string} resultText
     * @property {string} resultDesc
     * @property {string} description
     * @property {boolean} askFate
     * @property {number} fateCost
     * @property {number} fateBonus
     * @property {boolean} isOpposedTest
     * @property {string} initActorUuid
     * @property {string} initActorName
     * @property {string} initItemUuid
     * @property {string} initItemName
     * @property {string} initItemTypeLabel
     * @property {string} targetActorUuid
     * @property {string} targetActorName
     * @property {boolean} isSuccessValue
     * @property {number} successValue
     * @property {number} successValueExpr
     * @property {number} svBonus
     */

    /**
     *
     * @param {*} speaker
     * @param {*} actor
     * @param {*} token
     * @param {*} character
     * @param {*} noChat
     * @param {*} title
     * @param {*} type
     * @param {*} testResult
     * @returns
     */
    async successTestToChat({
        speaker,
        noChat = false,
        askFate,
        mlModJson,
        rollJson,
        type,
        title,
        isSuccessValue = false,
        fateBonus = 0,
        ...testResult
    }) {
        if (!speaker) {
            speaker = this.parent.actor
                ? ChatMessage.getSpeaker({ actor: this.parent.actor })
                : ChatMessage.getSpeaker();
        }
        const mlMod = this.constructor.fromJSON(mlModJson, this.parent);
        const roll = Roll.fromJSON(rollJson);

        const chatData = {
            mlMod: mlMod,
            type: type,
            title: title,
            typeLabel: this.parent.constructor.typeLabel,
            origTarget: mlMod.effective,
            modHtml: mlMod.chatHtml,
            successLevel: 0,
            successLevelMod: mlMod.successLevelMod,
            effTarget: mlMod.constrainedEffective,
            isCapped: mlMod.effective !== mlMod.constrainedEffective,
            isSuccess: false,
            isCritical: false,
            rollTotal: roll.total,
            lastDigit: roll.total % 10,
            resultText: "",
            resultDesc: "",
            description: "",
            testResultJson: JSON.stringify(testResult),
            nextTargetUuid: this.parent.item.uuid,
            isSuccessValue,
            successValueMod: -1,
            svSuccess: false,
            fateBonus,
        };

        const critAllowed =
            chatData.mlMod.critSuccessDigits.length ||
            chatData.mlMod.critFailureDigits.length;
        if (critAllowed) {
            if (roll.total <= chatData.effTarget) {
                if (
                    chatData.mlMod.critSuccessDigits.includes(
                        chatData.lastDigit,
                    )
                ) {
                    chatData.successLevel =
                        HM.CONST.SUCCESS_LEVEL.CriticalSuccess;
                } else {
                    chatData.successLevel =
                        HM.CONST.SUCCESS_LEVEL.MarginalSuccess;
                }
            } else {
                if (
                    chatData.mlMod.critFailureDigits.includes(
                        chatData.lastDigit,
                    )
                ) {
                    chatData.successLevel =
                        HM.CONST.SUCCESS_LEVEL.CriticalFailure;
                } else {
                    chatData.successLevel =
                        HM.CONST.SUCCESS_LEVEL.MarginalFailure;
                }
            }
        } else {
            if (roll.total <= chatData.effTarget) {
                chatData.successLevel = HM.CONST.SUCCESS_LEVEL.MarginalSuccess;
            } else {
                chatData.successLevel = HM.CONST.SUCCESS_LEVEL.MarginalFailure;
            }
        }
        chatData.successLevel += chatData.successLevelMod;
        chatData.successLevel += chatData.fateBonus;
        if (!critAllowed) {
            chatData.successLevel = Math.min(
                Math.max(
                    chatData.successLevel,
                    HM.CONST.SUCCESS_LEVEL.MarginalFailure,
                ),
                HM.CONST.SUCCESS_LEVEL.MarginalSuccess,
            );
        }
        chatData.isCritical =
            critAllowed &&
            (chatData.successLevel <= HM.CONST.SUCCESS_LEVEL.CriticalFailure ||
                chatData.successLevel >=
                    HM.CONST.SUCCESS_LEVEL.CriticalSuccess);
        chatData.isSuccess =
            chatData.successLevel >= HM.CONST.SUCCESS_LEVEL.MarginalSuccess;
        chatData.description = `${critAllowed ? (chatData.isCritical ? "Critical " : "Marginal ") : ""}${chatData.isSuccess ? "Success" : "Failure"}`;

        // If success level is greater than critical success or less than critical failure
        // then add the amount to the end of the description
        let successLevelIncr = 0;
        if (chatData.isCritical) {
            successLevelIncr =
                chatData.successLevel -
                (chatData.isSuccess
                    ? HM.CONST.SUCCESS_LEVEL.CriticalSuccess
                    : HM.CONST.SUCCESS_LEVEL.CriticalFailure);
        }
        if (successLevelIncr) {
            chatData.description = `${chatData.description} (${
                (successLevelIncr > 0 ? "+" : "") + successLevelIncr
            })`;
        }

        if (!chatData.isSuccessValue) {
            // If there is a table providing detailed description of
            // the results of this test, then process that table to
            // extract the detailed result descriptions.  Many tests
            // will not have these detailed descriptions, in which
            // case only generic descriptions will be given.
            if (chatData.mlMod.hasProperty("testDescTable")) {
                MasteryLevelModifier._handleDetailedDescription(
                    chatData,
                    chatData.successLevel,
                    chatData.mlMod.testDescTable,
                );
            }
        } else {
            chatData.successValueMod = chatData.successLevel - 1;
            chatData.successValue = this.index + chatData.successValueMod;
            const slSign = chatData.successValueMod < 0 ? "-" : "+";
            chatData.successValueExpr = `${
                this.index
            } ${slSign} ${Math.abs(chatData.successValueMod)}`;

            // Each MasteryLevel item may optionally
            // have its own success value table included; if
            // so, then that one will be used, otherwise the
            // default one will be used.
            const svTable =
                this.parent.item.getFlag("hm", "successValueTable") ||
                HM.sysVer.CONST.SUCCESS_VALUE_TABLE;

            // The meaning of the success value bonus ("svBonus") is
            // unique to each type of success value.  Sometimes it
            // represents the number of rolls on another table, or the
            // increase in value or quality of a crafted item, or any
            // other thing.  See the description of the specific test
            // to determine the meaning of the bonus.
            chatData.svBonus = MasteryLevelModifier._handleDetailedDescription(
                chatData,
                chatData.successValue,
                svTable,
            );
        }

        if (!noChat) {
            const chatTemplate =
                "systems/hm/templates/chat/standard-test-card.html";

            const html = await renderTemplate(chatTemplate, chatData);

            const messageData = {
                user: game.user.id,
                speaker,
                content: html.trim(),
                sound: CONFIG.sounds.dice,
            };

            ChatMessage.applyRollMode(messageData, "roll");

            // Create a chat message
            await ChatMessage.create(messageData);
        }

        return chatData;
    }

    /**
     * @typedef TestDetailedDescription
     * @property {number} maxValue maximum value that applies to this description
     * @property {number[]} lastDigit array of last digits that applies to this description
     * @property {string} label The short text of the description
     * @property {string} description The long text of the description
     */

    static _handleDetailedDescription(chatData, target, testDescTable) {
        let result = null;
        testDescTable.sort((a, b) => a.maxValue - b.maxValue);
        const testDesc = testDescTable.find(
            (entry) => entry.maxValue >= target,
        );
        if (testDesc) {
            // If the test description has a limitation based on
            // the last digit, find the one that applies.
            if (testDesc.limited?.length) {
                const limitedDesc = testDesc.limited.find((d) =>
                    d.lastDigits.includes(chatData.lastDigit),
                );
                if (limitedDesc) {
                    const label =
                        limitedDesc.label instanceof Function
                            ? limitedDesc.label(chatData)
                            : limitedDesc.label;
                    const desc =
                        limitedDesc.description instanceof Function
                            ? limitedDesc.description(chatData)
                            : limitedDesc.description;
                    chatData.resultText = label || "";
                    chatData.resultDesc = desc || "";
                    chatData.svSuccess = limitedDesc.success;
                    result = limitedDesc.result;
                }
            } else {
                const label =
                    testDesc.label instanceof Function
                        ? testDesc.label(chatData)
                        : testDesc.label;
                const desc =
                    testDesc.description instanceof Function
                        ? testDesc.description(chatData)
                        : testDesc.description;
                chatData.resultText = label || "";
                chatData.resultDesc = desc || "";
                chatData.svSuccess = testDesc.success;
                result = testDesc.result;
            }
        }

        if (result instanceof Function) result = result(chatData);

        return result;
    }
}

export class CombatModifier extends MasteryLevelModifier {
    /**
     * Creates an instance of CombatModifier.
     *
     * @constructor
     * @param {*} parent
     * @param {object} [initProperties={}]
     */
    constructor(parent, initProperties = {}) {
        super(
            parent,
            foundry.utils.mergeObject(
                initProperties,
                {
                    successLevelMod: 0,
                    fate: new MasteryLevelModifier(parent),
                },
                { inplace: false, recursive: false },
            ),
        );
    }

    static get vmName() {
        return "CombatModifier";
    }
}

export class SohlItem extends Item {
    /**
     * An object that tracks the changes to the data model which were applied by active effects.
     * See SohlActor.applyActiveEffects() for info on how this is set.
     * @type {object}
     */
    overrides = {};

    _uuid;
    _cause;

    /** @override */
    _configure(options) {
        if (this.parent && !(this.parent instanceof SohlActor)) {
            throw new Error("Parent must always be an instance of SohlActor");
        }

        super._configure(options);

        Object.defineProperty(this, "nestedIn", {
            value: (() => {
                if ([null, undefined].includes(options.nestedIn)) return null;
                if (options.nestedIn instanceof SohlItem)
                    return options.nestedIn;
                throw new Error(
                    "The provided nestedIn must be an SohlItem instance",
                );
            })(),
            writable: false,
            enumerable: false,
        });
    }

    _initialize(options = {}) {
        super._initialize(options);

        const newCause = options.cause || this.cause;
        if (newCause) this.cause = newCause;
    }

    get cause() {
        return this._cause;
    }

    set cause(item) {
        if (!this.actor) return;
        if (!(item instanceof SohlItem))
            throw new Error("must provide a valid cause");
        this._cause = item;
        if (!this.actor.system.virtualItems.has(this.id)) {
            this.actor.system.virtualItems.set(this.id, this);
        }
    }

    get label() {
        let label = `${this.name} `;
        if (this.system.subType)
            label += `${
                this.system.constructor.subTypes[this.system.subType]
            } `;
        label += this.system.constructor.typeLabel.singular;
        return label;
    }

    get isVirtual() {
        return !this.isNested && this.actor?.system.virtualItems.get(this.id);
    }

    get isNested() {
        return !!this.nestedIn;
    }

    get fromCompendiumOrWorld() {
        return !!(this.pack || game.items.some((it) => it.id === this.id));
    }

    /** @override */
    get actor() {
        return super.actor || this.nestedIn?.actor || this.cause?.actor;
    }

    get permission() {
        if (this.isNested) return this.nestedIn.permission;
        return super.permission();
    }

    get transferredEffects() {
        if (!this.actor) return [];

        // Collect all of the effects in the actor that match this item"s name
        const actorThisItemEffects = this.actor.effects.reduce(
            (itEffects, e) => {
                // If the effect"s targetType is not the same as this item, ignore it
                if (e.system.targetType !== this.actor.type) return itEffects;

                // Ignore the effect if it"s name doesn"t match the targetName
                const effectTargetName = new RegExp(e.system.targetNameRE);
                if (effectTargetName.test(this.actor.name))
                    return itEffects.concat(e);

                return itEffects;
            },
            [],
        );

        // Search through all sibling items for any which are targeting this item
        const siblingItemEffects = IterWrap.create(
            this.actor.allItems(),
        ).reduce((effects, it) => {
            if (it.id === this.id) return effects;
            const transferredItemEffects = it.effects.reduce((itEffects, e) => {
                // If the effect"s targetType is not the same as this item, ignore it
                if (e.system.targetType !== this.type) return itEffects;

                // Accept the effect if we have a skill base and the effect target is one of our attributes
                if (
                    this.system instanceof MasteryLevelItemData &&
                    e.targetAttr
                ) {
                    if (this.skillBase.attributes.includes(e.targetAttr)) {
                        return itEffects.concat(e);
                    }
                }

                // Accept the effect if it"s name matches the targetName
                const effectTargetName = new RegExp(e.system.targetNameRE);
                if (effectTargetName.test(this.name))
                    return itEffects.concat(e);

                // Otherwise, ignore the effect
                return itEffects;
            }, []);
            return effects.concat(transferredItemEffects);
        }, []);

        return actorThisItemEffects.concat(siblingItemEffects);
    }

    static defaultName({ type, parent, pack, subType } = {}) {
        const documentName = this.metadata.name;
        const cls = CONFIG[documentName].dataModels?.[type];
        let collection;
        if (parent) {
            if (!(parent instanceof SohlActor)) {
                throw new Error("parent must be an actor");
            } else {
                collection = new Collection(
                    IterWrap.create(parent.allItems()).map((it) => [it.id, it]),
                );
            }
        } else if (pack) {
            collection = game.packs.get(pack);
        } else {
            collection = game.collections.get(documentName);
        }

        const takenNames = new Set();
        for (const document of collection) takenNames.add(document.name);
        let baseName = CONFIG[documentName].typeLabels?.[type];
        if (subType) baseName = `${cls?.subTypes?.[subType]} ${baseName}`;
        let name = baseName;
        let index = 1;
        while (takenNames.has(name)) name = `${baseName} (${++index})`;
        return name;
    }

    /**
     * Creates a dialog for creating an item based on the provided data and options.
     *
     * @static
     * @async
     * @param {object} [data={}]
     * @param {object} [options={}]
     * @returns {SohlItem} the new SohlItem described by the dialog
     */
    static async createDialog(
        data = {},
        { parent = null, pack = null, types, ...options } = {},
    ) {
        const cls = this.implementation;

        data = foundry.utils.expandObject(data);

        // Identify allowed types
        let documentTypes = [];
        let defaultType = CONFIG[this.documentName]?.defaultType;
        let defaultTypeAllowed = false;
        // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        let hasTypes = false;
        if (this.TYPES.length > 1) {
            if (types?.length === 0)
                throw new Error(
                    "The array of sub-types to restrict to must not be empty",
                );

            // Register supported types
            for (const type of this.TYPES) {
                if (type === CONST.BASE_DOCUMENT_TYPE) continue;
                if (types && !types.includes(type)) continue;
                let label =
                    CONFIG[this.documentName]?.typeLabels?.[type] || type;
                documentTypes.push({ value: type, label });
                if (type === defaultType) defaultTypeAllowed = true;
            }
            if (!documentTypes.length)
                throw new Error(
                    "No document types were permitted to be created",
                );

            if (!defaultTypeAllowed) defaultType = documentTypes[0].value;
            // Sort alphabetically
            documentTypes.sort((a, b) =>
                a.label.localeCompare(b.label, game.i18n.lang),
            );
            hasTypes = true;
        }

        let askType =
            !!types || !documentTypes.some((t) => t.value === data.type);

        const itemClassSubtypes =
            HM.sysVer.CONFIG.Item.dataModels[defaultType].subTypes;
        let subTypes = itemClassSubtypes
            ? Object.entries(itemClassSubtypes).reduce((ary, [name, value]) => {
                  ary.push({ name, label: value });
                  return ary;
              }, [])
            : [];

        let askSubType =
            askType || !subTypes.some((t) => t.name === data.system?.subType);

        let subType;
        if (subTypes.length) {
            subType = data.system?.subType || subTypes[0]?.name;
        }

        // Identify destination collection
        let collection;
        if (!parent) {
            if (pack) collection = game.packs.get(pack);
            else collection = game.collections.get(this.documentName);
        }

        // Collect data
        const folders = collection?._formatFolderSelectOptions() ?? [];
        const label = game.i18n.localize(this.metadata.label);
        const title = game.i18n.format("DOCUMENT.Create", { type: label });
        const type = data.type || defaultType;

        const html = await renderTemplate(
            "templates/sidebar/document-create.html",
            {
                folders,
                name: data.name,
                defaultName: cls.defaultName({ type, parent, pack, subType }),
                folder: data.folder,
                hasFolders: folders.length >= 1,
                hasTypes: this.hasTypeData,
                type,
                types: documentTypes,
                subType,
                subTypes,
                content: `<div class="form-group" id="subtypes">
            <label>Sub-Types</label>
            <select
                class="resource-value"
                name="subType"
                data-dtype="String">
                {{selectOptions subTypes selected=subType valueAttr="name" labelAttr="label" }}
            </select>
        </div>`,
            },
        );

        return await Dialog.prompt({
            title,
            content: html,
            label: title,
            render: (html) => {
                const formTop = html.querySelector("form");
                const fd = new FormDataExtended(formTop);
                const formData = foundry.utils.mergeObject(fd.object, {
                    parent,
                    pack,
                    askType,
                    askSubType,
                });
                SohlItem._handleTypeChange(formTop, formData);
                html.querySelector('[name="type"]').addEventListener(
                    "change",
                    (ev) => {
                        formData.type = ev.target.value;
                        SohlItem._handleTypeChange(formTop, formData);
                    },
                );

                html.querySelector('[name="subType"]').addEventListener(
                    "change",
                    (ev) => {
                        formData.subType = ev.target.value;
                        SohlItem._handleTypeChange(formTop, formData);
                    },
                );
            },
            callback: (html) => {
                const formTop = html.querySelector("form");
                const fd = new FormDataExtended(formTop);
                const formData = foundry.utils.expandObject(fd.object);
                const formName = formData.name;
                const formType = formData.type || type;
                const formFolder = formData.folder;
                let formSubType = formData.subType || subType;
                formSubType = formSubType?.replace(" selected", "") || "";

                data.name = formName;
                if (!data.name?.trim())
                    data.name = this.defaultName({
                        type: formType,
                        parent: parent,
                        pack: pack,
                        subType: formSubType,
                    });
                if (formFolder) {
                    data.folder = formFolder;
                } else {
                    delete data.folder;
                }

                data.type = formType || type;

                const subTypes =
                    HM.sysVer.CONFIG.Item.dataModels[data.type].subTypes;
                if (subTypes && Object.keys(subTypes)?.includes(formSubType)) {
                    data["system.subType"] = formSubType;
                }

                // Make sure gear goes into the top container of the
                // actor unless specifically nested elsewhere
                let nestedIn = options.nestedIn;

                return this.implementation.create(data, {
                    parent,
                    pack,
                    nestedIn,
                    renderSheet: true,
                });
            },
            rejectClose: false,
            options: { jQuery: false, ...options },
        });
    }

    /**
     * Handles the type change event for the create item dialog by updating the
     * form elements based on the selected type and subtype options.
     *
     * @static
     * @param {*} formTop
     * @param {object} dlgOptions
     */
    static _handleTypeChange(
        formTop,
        { type, subType, askType, askSubType, parent, pack } = {},
    ) {
        const formSubtypes = formTop.querySelector("#subtypes");
        const formSubtypeSelect = formTop.querySelector('[name="subType"]');
        formTop.elements.type.disabled = !askType;

        // Determine if subtypes exist for this type, and if so, create the subtype dropdown
        const subTypeObj = HM.sysVer.CONFIG.Item.dataModels[type]?.subTypes;
        if (typeof subTypeObj === "object" && Object.keys(subTypeObj).length) {
            let subTypes = Object.entries(subTypeObj)?.reduce(
                (ary, [name, value]) => {
                    ary.push({ name, label: value });
                    return ary;
                },
                [],
            );

            // Create subtype dropdown
            subType = subTypes.some((t) => t.name === subType)
                ? subType
                : subTypes[0].name;
            formSubtypes.style.visibility = "visible";
            const selectOptions = subTypes.reduce((str, st) => {
                str += `<option value="${st.name}${
                    st.name === subType ? " selected" : ""
                }">${st.label}</option>`;
                return str;
            }, "");
            formSubtypeSelect.innerHTML = selectOptions;
            formTop.elements.subType.value = `${subType} selected`;
            formSubtypeSelect.disabled = !askSubType;
        } else {
            // Hide subtype dropdown if type doesn't support it
            formSubtypes.style.visibility = "hidden";
            subType = "";
        }

        // Update the item name field placeholder
        const nameInput = formTop.querySelector('[name="name"]');
        nameInput.placeholder = this.defaultName({
            type,
            parent,
            pack,
            subType,
        });
    }

    *allApplicableEffects() {
        // Grab all of the effects on this item that affects itself
        const effects = this.actor.effects.filter(
            (e) => e.system.targetType === "this",
        );
        for (const effect of effects) {
            yield effect;
        }

        // Add all of the transferred effects from the items that affect this actor
        for (const effect of this.transferredEffects) {
            yield effect;
        }
    }

    applyActiveEffects() {
        if (!this.actor) return;

        const overrides = {
            [this.id]: {},
        };

        // Organize non-disabled effects by their application priority
        const changes = [];
        for (const effect of this.allApplicableEffects()) {
            if (!effect.active) continue;
            const targets = effect.targets;
            if (!targets.length) continue;
            changes.push(
                ...effect.changes.map((change) => {
                    const c = foundry.utils.deepClone(change);
                    c.targets = targets;
                    c.effect = effect;
                    c.priority = c.priority ?? c.mode * 10;
                    return c;
                }),
            );
        }
        changes.sort((a, b) => a.priority - b.priority);

        // Apply all changes
        for (let change of changes) {
            if (!change.key) continue;
            if (!change.targets?.length) continue;
            change.targets.forEach((t) => {
                const changes = change.effect.apply(t, change);
                if (Object.keys(changes).length) {
                    if (typeof overrides[t.id] === "object")
                        foundry.utils.mergeObject(overrides[t.id], changes);
                    else overrides[t.id] = changes;
                }
            });
        }

        // Expand the set of final overrides
        this.overrides = foundry.utils.expandObject(overrides[this.id]);
        IterWrap.create(this.actor.allItems()).forEach((it) => {
            if (overrides[it.id])
                it.overrides = foundry.utils.expandObject(overrides[it.id]);
        });
    }

    /**
     * Create a list of updates to the origin of all effects of this item to point to this item
     *
     * @returns an Array of updates
     */
    updateEffectsOrigin() {
        let result = [];

        result = this.effects.reduce((toUpdate, e) => {
            if (e.origin !== this.uuid) {
                const updateData = { _id: e.id, origin: this.uuid };
                return toUpdate.concat(updateData);
            }
            return toUpdate;
        }, result);

        return result;
    }

    async _onSortItem(event, itemData) {
        // Get the drag source and drop target
        const items = this.system.items;
        const source = items.get(itemData._id);
        const dropTarget = event.target.closest("[data-item-id]");
        if (!dropTarget) return;
        const target = items.get(dropTarget.dataset.itemId);

        // Don't sort on yourself
        if (source.id === target.id) return;

        // Identify sibling items based on adjacent HTML elements
        const siblings = [];
        for (let el of dropTarget.parentElement.children) {
            const siblingId = el.dataset.itemId;
            if (siblingId && siblingId !== source.id)
                siblings.push(items.get(el.dataset.itemId));
        }

        // Perform the sort
        const sortUpdates = SortingHelpers.performIntegerSort(source, {
            target,
            siblings,
        });

        const newAry = foundry.utils.deepClone(this.system.nestedItems);

        sortUpdates.forEach((u) => {
            const target = newAry.find((ent) => ent._id === u.target.id);
            target.sort = u.update.sort;
        });

        newAry.sort((a, b) => a.sort - b.sort);

        // Perform the update
        await this.update({ "system.nestedItems": newAry });
    }

    /** @override */
    async _preCreate(data, options, userId) {
        const allowed = await super._preCreate(data, options, userId);
        if (!allowed) return false;

        const updateData = {};
        // Unless specifically overriden, gear and body types have the
        // "transfer" property set to true
        if (data.type.endsWith("gear") || data.type.startsWith("body")) {
            if (foundry.utils.getProperty("system.transfer") === undefined) {
                updateData["system.transfer"] = true;
            }
        }
        this.updateSource(updateData);
        return true;
    }

    /** @override */
    _onCreate(data, options, userId) {
        super._onCreate(data, options, userId);
        const toUpdate = this.updateEffectsOrigin();
        if (toUpdate.length)
            this.updateEmbeddedDocuments("ActiveEffect", toUpdate);
    }

    /** @override */
    get uuid() {
        if (!this._uuid) {
            if (this.nestedIn) {
                // If this is a nested object, we come up with a new UUID format
                // where the nested item is defined with a hash mark
                let parts = [this.nestedIn.uuid, "NestedItem", this.id];
                this._uuid = parts.join("#");
            } else if (this.cause) {
                // If this is a virtual object, but not nested, then the UUID is
                // virtually useless; this is an ephemeral object, and cannot be usefully
                // referred to in any meaningful way.  Nevertheless, to allow for identity,
                // we construct a value that will be unique for this virtual item on this actor.
                // HOWEVER: Note that storing or referring to this ID is problematic, since the
                // _id of pure virtual items changes every time the actor is refreshed.
                let parts = [this.actor.uuid, "VirtualItem", this.id];
                this._uuid = parts.join("#");
            } else {
                this._uuid = super.uuid;
            }
        }

        return this._uuid;
    }

    /**
     * Merge sourceItem into this item. sourceItem and this item must be the same
     * type, have the same name, and if the type has subtypes, must be the same
     * subtype. If type is a gear type, then simply update the quantity instead.
     *
     * @param {SohlItem} this Item that will remain when merge is complete
     * @param {SohlItem} sourceItem Item to merge into destItem
     * @returns {boolean} true if merge succeeded, false otherwise
     */
    async merge(sourceItem, { quantity = 0 } = {}) {
        if (this.id === sourceItem.id) {
            // Cannot merge an item onto itself
            return false;
        }

        if (this.cause && !this.nestedIn) {
            // this is a pure virtual item, no merge allowed
            return false;
        }

        if (this.type !== sourceItem.type) {
            return false;
        }

        if (this.name !== sourceItem.name) {
            return false;
        }

        // Special case of gear: update the quantity
        if (this.system instanceof GearItemData) {
            // If quantity is 0, then move all of the quantity
            if (!quantity) quantity = sourceItem.system.quantity;

            let result = await this.update({
                "system.quantity": this.system.quantity + quantity,
            });
            if (result) {
                const remainingQuantity = sourceItem.system.quantity - quantity;
                if (!remainingQuantity) {
                    await sourceItem.delete();
                } else {
                    result = await sourceItem.update({
                        "system.quantity": remainingQuantity,
                    });
                    return result;
                }
            }
        }

        // If sub-types don't match, then return without change
        if (this.system.subType !== sourceItem.system.subType) {
            return false;
        }

        const updateData = sourceItem.toObject();

        // Remove standard Item fields that should not be updated
        delete updateData._id;
        delete updateData.name;
        delete updateData.type;
        delete updateData.ownership;
        delete updateData._stats;
        delete updateData.sort;

        // Don't change the creation date of the item
        delete updateData.system.createdTime;

        // Only update descriptive data if the fields are currently empty;
        // don't overwrite existing data
        if (updateData.system.subType) delete updateData.system.subType;
        if (this.system.notes) delete updateData.system.notes;
        if (this.system.textReference) delete updateData.system.textReference;
        if (this.system.description) delete updateData.system.description;

        // Only update the image if the new one is not the Default Icon
        if (updateData.img === SohlItem.DEFAULT_ICON) delete updateData.img;

        // Handle Mastery Level Items
        if (sourceItem.system instanceof MasteryLevelItemData) {
            delete updateData.system.masteryLevelBase;
        }

        // Generally, all fields will be updated.  Depending on the
        // specific type, some fields will be left unchanged.
        switch (sourceItem.type) {
            case MysteryItemData.typeName:
                delete updateData.system.charges;
                break;

            case MysticalAbilityItemData.typeName:
                delete updateData.system.charges;
                break;

            case AfflictionItemData.typeName:
                delete updateData.system.healingRateBase;
                break;

            case TraitItemData.typeName:
                if (sourceItem.system.textValue)
                    delete updateData.system.textValue;
                if (sourceItem.system.max) delete updateData.system.max;
                break;

            case BodyPartItemData.typeName:
                delete updateData.system.heldItem;
                break;
        }

        const result = await this.update(updateData);
        return !!result;
    }

    getNestedItemById(itemId) {
        let found = this.system.items.get(itemId);
        if (!found && this.system instanceof ContainerGearItemData) {
            for (let it of this.system.items) {
                if (it.system instanceof ContainerGearItemData) {
                    found = it.system.items.get(itemId);
                    if (found) break;
                }
            }
        }

        return found;
    }

    async nestIn(
        nestTarget,
        { quantity = Number.MAX_SAFE_INTEGER, destructive = false } = {},
    ) {
        let newItem = null;
        if (
            !(nestTarget instanceof SohlItem || nestTarget instanceof SohlActor)
        ) {
            throw new Error("Must specify a destination item to nest into");
        }
        if (!quantity) return null;
        destructive &&= !(this.fromCompendiumOrWorld || this.isVirtual);

        const siblings =
            nestTarget instanceof SohlItem
                ? nestTarget.system.items.contents
                : nestTarget.items.contents;
        const similarSibling = siblings.find(
            (it) =>
                it.name === this.name &&
                it.type === this.type &&
                it.system.subType === this.system.subType,
        );

        if (similarSibling) {
            if (this.fromCompendiumOrWorld) {
                /* TODO: Implement refresh items recursively
                // Ask whether to refresh the item from World/Compendium
                const overwrite = await Dialog.confirm({
                    title: "Confirm Overwrite",
                    content: `<p>Overwrite existing ${similarSibling.system.constructor.typeLabel.singlular} ${similarSibling.name}?</p>`,
                    defaultYes: false,
                    options: { jQuery: false },
                });
                */
                ui.notifications.warn(
                    `An Item named ${this.name} exists in ${nestTarget.name}, cannot create new item with same name`,
                );
                return null;
            } else if (similarSibling.id === this.id) {
                // Don't re-nest an item if it is already there
                ui.notifications.warn(
                    `Identical Item ${this.name} already exists in ${nestTarget.name}`,
                );
                return null;
            }

            if (this.system instanceof GearItemData) {
                // In the case of gear, which has quantity, we need to consider
                // how many to copy over.
                if (!this.fromCompendiumOrWorld) {
                    // Copy everything unless otherwise specified
                    quantity = Math.max(
                        0,
                        Math.min(this.system.quantity, quantity),
                    );
                    await similarSibling.update({
                        "system.quantity":
                            similarSibling.system.quantity + quantity,
                    });
                    if (destructive) {
                        if (this.system.quantity > quantity) {
                            await this.update({
                                "system.quantity":
                                    this.system.quantity - quantity,
                            });
                        } else {
                            await this.delete();
                        }
                    }
                }
            } else {
                ui.notification.warn(
                    `Similar sibling already exists, move denied`,
                );
                return null;
            }
        } else {
            // Nothing similar exists, so we need to nest a new item
            const newData = this.toObject();
            delete newData._id;

            const createOptions = {
                clean: true,
                nestedIn: nestTarget instanceof SohlItem ? nestTarget : null,
                parent:
                    nestTarget instanceof SohlItem
                        ? nestTarget.actor
                        : nestTarget,
            };

            if (
                this.fromCompendiumOrWorld ||
                !(this.system instanceof GearItemData)
            ) {
                newItem = await this.constructor.create(newData, createOptions);
            } else {
                // Copy all gear unless otherwise specified
                quantity = Math.max(
                    0,
                    Math.min(this.system.quantity, quantity),
                );
                newData.system.quantity = quantity;
                newItem = await this.constructor.create(newData, createOptions);
                if (destructive) {
                    if (this.system.quantity > quantity) {
                        await this.update({
                            "system.quantity": this.system.quantity - quantity,
                        });
                    } else {
                        await this.delete();
                    }
                }
            }
        }

        return newItem;
    }

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    static async fromDropData(data, options = {}) {
        let document = null;

        // Case 1 - Data explicitly provided
        if (data.data) document = new this(data.data);
        // Case 2 - UUID provided
        else if (data.uuid) document = await fromUuid(data.uuid);

        // Ensure that we retrieved a valid document
        if (!document) {
            throw new Error(
                "Failed to resolve Document from provided DragData. Either data or a UUID must be provided.",
            );
        }
        if (document.documentName !== this.documentName) {
            throw new Error(
                `Invalid Document type '${document.type}' provided to ${this.name}.fromDropData.`,
            );
        }

        // Flag the source UUID
        if (document.id && !document._stats?.compendiumSource) {
            let uuid = document.uuid.split("#").at(0);
            document.updateSource({ "_stats.compendiumSource": uuid });
        }
        return document;
    }

    static _resetIds(data, _i = 0) {
        if (_i > 99) {
            throw new Error("Maximum depth exceeded");
        }
        data._id = foundry.utils.randomID();
        if (data.system?.macros?.length) {
            for (let m of data.system.macros) {
                m._id = foundry.utils.randomID();
            }
        }
        if (data.system?.nestedItems?.length) {
            for (let obj of data.system.nestedItems) {
                SohlItem._resetIds(obj, _i + 1);
            }
        }
        if (data.effects?.length) {
            for (let e of data.effects) {
                e._id = foundry.utils.randomID();
            }
        }
    }

    static async create(data, options = {}) {
        let newData = foundry.utils.deepClone(data);

        if (Object.keys(newData).some((k) => /\./.test(k))) {
            newData = foundry.utils.expandObject(newData);
        }

        if (!data.type) {
            throw new Error("Must specify type of item to create");
        }

        if (options.clean) {
            delete newData.folder;
            delete newData.sort;
            delete newData.pack;
            if ("ownership" in newData) {
                newData.ownership = {
                    default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
                    [game.user.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
                };
            }

            // Clear and disable all events associated with the item
            if (newData.system?.nestedItems.length) {
                for (const obj of newData.system.nestedItems) {
                    if (obj.type === "event" && obj.system.activation.enabled) {
                        obj.system.activation.enabled = false;
                        obj.system.activation.startTime = 0;
                        obj.system.activation.endTime = 0;
                    }
                }
            }
        }

        if (options.parent && !(options.parent instanceof SohlActor))
            throw new Error("parent must always be an instance of SohlActor");

        if (!(newData._id && options.keepId)) {
            SohlItem._resetIds(newData);
        }

        if (!newData.img) {
            newData.img =
                HM.sysVer.CONFIG.Item.dataModels[newData.type]?.defaultImage;
        }

        // If nestedIn is specified, use update() on the nestedIn
        if (options.nestedIn) {
            if (options.nestedIn && !(options.nestedIn instanceof SohlItem)) {
                throw new Error(`nestedIn must be an SohlItem document`);
            }

            const newAry = foundry.utils.deepClone(
                options.nestedIn.system.nestedItems,
            );

            const itemExists = newAry.some((obj) => obj._id === newData._id);
            if (itemExists) {
                throw new Error(
                    `Item with id ${newData._id} already exists in ${options.nestedIn.label}`,
                );
            }

            let item = new SohlItem(newData, options);
            //await item._preCreate(newData, options, game.user);
            const itemData = item.toObject();

            // Set sort property
            let maxSort = newAry.reduce(
                (max, obj) => Math.max(max, obj.sort),
                0,
            );
            maxSort += CONST.SORT_INTEGER_DENSITY;
            itemData.sort = maxSort;
            newAry.push(itemData);

            const result = await options.nestedIn.update(
                { "system.nestedItems": newAry },
                { nestedIn: options.nestedIn },
            );

            return result;
        } else {
            return await super.create(newData, options);
        }
    }

    /** @override */
    update(data = [], context = {}) {
        // Note that this method will return a direct response if called
        // on an item with an nestedIn, otherwise it will return a Promise.

        let result = this.cause;

        if (this.nestedIn || this.cause) {
            this.updateSource(data);
        }

        if (this.nestedIn) {
            const newAry = foundry.utils.deepClone(
                this.nestedIn.system.nestedItems,
            );
            const idx = newAry.findIndex((obj) => obj._id === this.id);
            if (idx >= 0) {
                const expandedData = foundry.utils.expandObject(data);
                foundry.utils.mergeObject(newAry[idx], expandedData, {
                    performDeletions: true,
                });
                newAry.sort((a, b) => a.sort - b.sort);
                const updateData = {
                    "system.nestedItems": newAry,
                };
                result = this.nestedIn.update(updateData, context);
            }
        } else if (!this.cause) {
            result = super.update(data, context);
        }

        return result;
    }

    /** @override */
    delete(context = {}) {
        // Note that this method will return a direct response if called
        // on an item with either nestedIn or cause with a truthy value,
        // otherwise it will return a Promise.
        if (this.nestedIn || this.cause) {
            if (this.nestedIn) {
                const newAry = foundry.utils.deepClone(
                    this.nestedIn.system.nestedItems,
                );
                const filtered = newAry.filter((obj) => obj._id !== this.id);
                if (filtered.length !== newAry.length) {
                    this.nestedIn.update(
                        { "system.nestedItems": filtered },
                        context,
                    );
                }
            }

            if (this.cause) {
                this.actor.system.virtualItems.delete(this.id);
                this.actor.render();
            }

            return this;
        } else {
            return super.delete(context);
        }
    }
}

export class SohlBaseData extends foundry.abstract.TypeDataModel {
    /**
     * An object containing collections, including macros and nested items
     *
     * @type {object}
     */
    _collections = {};

    static get comparison() {
        return {
            IDENTICAL: 0,
            SIMILAR: 1,
            DIFFERENT: 2,
        };
    }

    static get typeName() {
        throw new Error("Subclass must define typeName");
    }

    static get typeLabel() {
        throw new Error("Subclass must define typeLabel");
    }

    same(other) {
        if (
            this.constructor === other?.constructor &&
            this.macros.length === other.macros.length
        ) {
            // TODO: Compare macros are identical
            return SohlBaseData.comparison.IDENTICAL;
        }
        return SohlBaseData.comparison.DIFFERENT;
    }

    static get defaultImage() {
        return "icons/svg/item-bag.svg";
    }

    static get effectKeys() {
        return {};
    }

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    getEvent(eventTag) {
        throw new Error("Subclass must define getEvent");
    }

    static get eventTags() {
        return {
            none: "",
            created: "Created",
            lastmod: "Last Modified",
        };
    }

    static get mods() {
        return {
            Player: { name: "Player Modifier", abbrev: "PlyrMod" },
            MinValue: { name: "Minimum Value", abbrev: "MinVal" },
            MaxValue: { name: "Maximum Value", abbrev: "MaxVal" },
            AE: { name: "Active Effect", abbrev: "AE" },
            Base: { name: "Base", abbrev: "Base" },
            Outnumbered: { name: "Outnumbered", abbrev: "Outn" },
            OffHand: { name: "Off-Hand Weapon Use", abbrev: "OffHnd" },
        };
    }

    static get sheet() {
        throw new Error("Must define sheet path in subclass of SohlBaseData");
    }

    get availableFate() {
        return false;
    }

    get actor() {
        if (this.parent instanceof SohlActor) {
            return this.parent;
        } else if (this.parent instanceof SohlItem) {
            return this.parent.actor;
        } else {
            return null;
        }
    }

    async setupActionCache() {
        let ary = [];
        this.macros.forEach((m) => {
            const macro = new SohlMacro(m, {
                nestedIn: this.parent,
                keepId: true,
            });
            if (!macro) {
                console.error(
                    `Failure to create macro ${m.name} on ${this.parent.name}`,
                );
            } else {
                ary.push([macro.id, macro]);
            }
        });

        // Finally, add in the intrinsic actions (unless an action with same
        // name has already been added).  All of these macros will have the
        // flag "flags.hm.isIntrinsicAction" set to true.
        this.intrinsicActions.forEach((intrinsicAction) => {
            if (!ary.some(([, m]) => m.name === intrinsicAction.name)) {
                let contextCondition;
                const condType = typeof intrinsicAction.contextCondition;
                if (intrinsicAction.contextCondition instanceof Function) {
                    contextCondition = intrinsicAction.contextCondition;
                } else if (condType === "boolean") {
                    contextCondition = intrinsicAction.contextCondition;
                } else {
                    contextCondition = false;
                }
                const macro = new SohlMacro(
                    {
                        name: intrinsicAction.name,
                        _id: Utility.createHash16(
                            this.parent.uuid + intrinsicAction.name,
                        ),
                        type: CONST.MACRO_TYPES.SCRIPT,
                        img: "systems/hm/assets/icons/default-action.svg",
                        flags: {
                            hm: {
                                notes: "",
                                description: "",
                                params: {},
                                functionName: intrinsicAction.functionName,
                                contextLabel: intrinsicAction.name,
                                contextIconClass:
                                    intrinsicAction.contextIconClass,
                                contextCondition,
                                contextGroup: intrinsicAction.contextGroup,
                                isIntrinsicAction: true,
                                useAsync: !!intrinsicAction.useAsync,
                            },
                        },
                    },
                    { nestedIn: this.parent },
                );

                ary.push([macro.id, macro]);
            }
        });

        // Only accept the first default, all others set to Primary
        let hasDefault = false;
        ary.forEach((a) => {
            const isDefault =
                foundry.utils.getProperty(a[1], "flags.hm.contextGroup") ===
                SohlContextMenu.sortGroups.Default;
            if (hasDefault) {
                if (isDefault) {
                    foundry.utils.setProperty(
                        a[1],
                        "flags.hm.contextGroup",
                        SohlContextMenu.sortGroups.Primary,
                    );
                }
            } else {
                hasDefault ||= isDefault;
            }
        });

        ary.sort((a, b) => {
            const contextGroupA =
                a[1].getFlag("hm", "contextGroup") ||
                SohlContextMenu.sortGroups.General;
            const contextGroupB =
                b[1].getFlag("hm", "contextGroup") ||
                SohlContextMenu.sortGroups.General;
            return contextGroupA.localeCompare(contextGroupB);
        });

        // If no default was specified, then make the first element the default
        if (!hasDefault && ary.length) {
            foundry.utils.setProperty(
                ary[0][1],
                "flags.hm.contextGroup",
                SohlContextMenu.sortGroups.Default,
            );
        }

        if (this._collections.actions) delete this._collections.actions;
        ary.forEach((a) => this.actions.set(a[0], a[1]));
    }

    get actions() {
        this._collections.actions ||= new Collection();
        return this._collections.actions;
    }

    /**
     * Returns an array of predefined action descriptors for this item.  These
     * actions are already implemented in code, so they are always available.  These
     * can be specifically overridden by a macro with the same name.
     *
     * @readonly
     * @type {{}}
     */
    get intrinsicActions() {
        return [];
    }

    get events() {
        const result =
            IterWrap.create(this.actor?.allItems()).reduce((obj, it) => {
                if (it.system instanceof EventItemData && it.system.isEnabled) {
                    // First, get all events targetting this item.
                    if (it.system.$targetUuid === this.uuid) {
                        obj[it.name] = {
                            name: it.name,
                            uuid: it.uuid,
                            source: it.nestedIn || this.actor,
                            sourceName:
                                it.nestedIn?.label || this.actor?.label || "",
                            target: this.item,
                            targetName: this.item.label,
                            when: it.system.activation.endTime,
                            remaining: it.system.remainingDuration,
                            oper:
                                EventItemData.operators[
                                    it.system.activation.oper
                                ] || "",
                            actionName: it.system.actionName,
                            item: it,
                        };
                    }

                    // Next, add any event that are nested in this item.
                    if (
                        it.nestedIn?.uuid === this.uuid &&
                        !Object.hasOwn(it.uuid)
                    ) {
                        obj[it.uuid] = {
                            name: it.name,
                            uuid: it.uuid,
                            source: it.nestedIn || this.actor,
                            sourceName:
                                it.nestedIn?.label || this.actor?.label || "",
                            target: it.system.target,
                            targetName:
                                it.system.target.uuid === it.uuid
                                    ? "Self"
                                    : it.system.target?.label || "",
                            when: it.system.activation.endTime,
                            remaining: it.system.remainingDuration,
                            oper:
                                EventItemData.operators[
                                    it.system.activation.oper
                                ] || "",
                            actionName: it.system.actionName,
                            item: it,
                        };
                    }
                }
                return obj;
            }, {}) || {};
        return result;
    }

    /** @override */
    static defineSchema() {
        return {
            macros: new fields.ArrayField(new fields.ObjectField()),
        };
    }

    getDefaultAction(html) {
        const contextOptions = this._getContextOptions();
        const defAction = contextOptions.find(
            (co) =>
                co.group === SohlContextMenu.sortGroups.Default &&
                (co.condition instanceof Function
                    ? co.condition(html)
                    : co.condition),
        );
        return defAction;
    }

    _getContextOptions() {
        let result = this.actions.reduce((ary, m) => {
            const contextCondition = m.contextCondition;
            let cond = contextCondition;
            if (typeof contextCondition === "string") {
                if (!contextCondition || /^true$/i.test(contextCondition)) {
                    cond = true;
                } else if (/^false$/i.test(contextCondition)) {
                    cond = false;
                } else {
                    cond = function (header) {
                        const fn = new Function(
                            "header",
                            `{${contextCondition}}`,
                        );

                        try {
                            return fn.call(header);
                        } catch (err) {
                            Hooks.onError(
                                "SohlBaseData#_getContextOptions",
                                err,
                                {
                                    msg: `Error executing context condition for ${m.name} on ${this.parent.name}`,
                                    log: "error",
                                },
                            );
                        }
                    };
                }
            }

            if (cond) {
                const newAction = {
                    name: m.name,
                    icon: `<i class="${m.contextIconClass}"></i>`,
                    condition: cond,
                    callback: () => {
                        this.execute(m.name);
                    },
                    group: m.contextGroup,
                };
                ary.push(newAction);
            }
            return ary;
        }, []);
        return result;
    }

    /**
     * Execute an action.  Executes a macro if available, otherwise executes any
     * default implementation.  Executes synchronously unless otherwise specified.
     *
     * @param {string} actionName Name of the action to perform
     * @param {object} options Execution parameters which are passed to the action
     * @param {boolean} [options.async=false] Whether to execute this action as an async function
     * @param {object[]} [options.scope] additional parameters
     */
    execute(actionName, { inPrepareData = false, ...scope } = {}) {
        if (!actionName) return;

        let action = this.actions.find(
            (a) => a.name === actionName || a.functionName === actionName,
        );
        if (action) {
            scope.actionName = actionName;
            scope.self = this;
            scope.inPrepareData = inPrepareData;
            return action.execute(scope);
        }
        return null;
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.setupActionCache();
    }
}

export class SohlActorData extends SohlBaseData {
    /**
     * Virtual items either inherited or synthesized
     *
     * @type {Collection}
     */
    #virtualItems;

    /**
     * Represents the weight of gear being carried by an actor.
     *
     * @type {ValueModifier}
     */
    $gearWeight;

    /**
     * Indicates whether the setup process has been completed.
     *
     * @type {boolean}
     */
    $isSetup;

    get virtualItems() {
        if (!this.#virtualItems) this.#virtualItems = new Collection();
        return this.#virtualItems;
    }

    getEvent(eventTag) {
        return this.actor.items.find(
            (it) =>
                it.system instanceof EventItemData &&
                it.system.tag === eventTag,
        );
    }

    static get sheet() {
        return "systems/hm/templates/actor/actor-sheet.html";
    }

    /** @override */
    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            bioImage: new fields.FilePathField({
                categories: ["IMAGE"],
                initial: CONST.DEFAULT_TOKEN,
                label: "Biographical Image",
            }),
            description: new fields.HTMLField({
                initial: "",
                label: "Description",
                hint: "Physical description and traits",
            }),
            biography: new fields.HTMLField({
                initial: "",
                label: "Biography",
                hint: "Backstory and biographical information",
            }),
        });
    }

    static get effectKeys() {
        return Utility.simpleMerge(super.effectKeys, {
            "mod:system.$engagedOpponents": {
                label: "Engaged Opponents",
                abbrev: "EngOpp",
            },
            "mod:system.$gearWeight": {
                label: "Weight Carried",
                abbrev: "WtCar",
            },
        });
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$collection = new Collection();
        this.$gearWeight = new ValueModifier(this, {
            maxFight: new ValueModifier(this),
            max: new ValueModifier(this),
            value: (thisVM) => {
                return Math.round(thisVM.effective * 1000) / 1000;
            },
            status: (thisVM) => {
                if (thisVM.effective > thisVM.max.effective)
                    return ContainerGearItemData.status.OverCapacity;
                else if (thisVM.effective > thisVM.maxFight.effective)
                    return ContainerGearItemData.status.OverFightCapacity;
                else return ContainerGearItemData.status.Ok;
            },
        });

        // The maximum weights here are totally arbitrary.  To get reasonable values,
        // it is expected for the actor to have a "capacity" trait that sets these
        // values correctly.
        this.$gearWeight.maxFight.setBase(50);
        this.$gearWeight.max.setBase(75);
    }

    checkExpired() {
        IterWrap.create(this.actor.allItems()).forEach((it) => {
            it.system.checkExpired();
        });
    }
}

export class SohlItemData extends SohlBaseData {
    static get sheet() {
        return `systems/hm/templates/item/${this.typeName}-sheet.html`;
    }

    getEvent(eventTag) {
        return this.items.find(
            (it) =>
                it.system instanceof EventItemData &&
                it.system.tag === eventTag,
        );
    }

    get containers() {
        const result = this.items.reduce((ary, ei) => {
            if (ei.system instanceof ContainerGearItemData) {
                ary.push(ei);
            }
            return ary;
        }, []);
        return result;
    }

    /**
     * Returns the collection of nested, but not active, items.
     * These items do not get processed by prepareData(). These are
     * not yet true items; in order to get processed, these items must
     * be copied to the SohlActor#virtualItems collection prior to processing
     * the nested collections.
     *
     * For example, the GearItemData#prepareBaseData method will copy all
     * of the "gear" items to the SohlActor#virtualItems collection so they get
     * processed.  Similar actions occur with other items.
     */
    get items() {
        this._collections.items ||= new Collection();
        return this._collections.items;
    }

    get item() {
        if (this.parent instanceof SohlItem) {
            return this.parent;
        }
        throw new Error(
            `Invalid SohlItemData: must be associated with an SohlItem parent`,
        );
    }

    get topItem() {
        if (!this.item.cause) {
            if (!this.item.nestedIn) {
                return this.item;
            } else {
                return this.item.nestedIn.system.topItem;
            }
        } else {
            return this.item.cause.system.topItem;
        }
    }

    /** @override */
    get actor() {
        return this.item.actor;
    }

    get id() {
        return this.item.id;
    }

    get name() {
        return this.item.name;
    }

    get img() {
        return this.item.img;
    }

    get uuid() {
        return this.item.uuid;
    }

    get transferToActor() {
        return this.transfer;
    }

    same(other) {
        let result = super.same(other);
        if (result === SohlBaseData.comparison.DIFFERENT) return result;
        if (
            this.notes === other.notes &&
            this.description === other.description &&
            this.textReference === other.textReference &&
            this.transfer === other.transfer &&
            this.nestedItems.length === other.nestedItems.length
        ) {
            // TODO: Check that each nestedItem is identical
            return result;
        }
        return SohlBaseData.comparison.DIFFERENT;
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            notes: new fields.StringField({
                initial: "",
                label: "Notes",
            }),
            description: new fields.HTMLField({
                initial: "",
                label: "Description",
            }),
            textReference: new fields.StringField({
                initial: "",
                label: "Reference",
            }),
            nestedItems: new fields.ArrayField(new fields.ObjectField()),
            transfer: new fields.BooleanField({
                initial: false,
                label: "Transfer to Actor",
            }),
        });
    }

    /** @override */
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    async _preCreate(data, options, userId) {
        return true;
    }

    async deleteItem() {
        let title = `Delete Item: ${this.name}`;
        let content =
            "<p>Are You Sure?</p><p>This item will be deleted and cannot be recovered.</p>";

        if (this instanceof ContainerGearItemData) {
            title = `Delete Container: ${this.name}`;
            content +=
                "<p>WARNING: All items in this container will be deleted as well!</p>" +
                content;
        }

        // Create the dialog window
        const agree = await Dialog.confirm({
            title: title,
            content: content,
            yes: () => true,
        });

        if (agree) {
            await this.item.delete();
        }
    }

    async editItem() {
        await this.item.sheet.render(true);
    }

    get intrinsicActions() {
        return [
            {
                functionName: "editItem",
                name: "Edit",
                contextIconClass: "fas fa-edit",
                contextCondition: (header) => {
                    if (game.user.isGM) return true;
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return item?.isOwner;
                },
                contextGroup: SohlContextMenu.sortGroups.General,
            },
            {
                functionName: "deleteItem",
                name: "Delete",
                contextIconClass: "fas fa-trash",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return (
                        !item?.isVirtual && (game.user.isGM || item?.isOwner)
                    );
                },
                contextGroup: SohlContextMenu.sortGroups.General,
            },
            {
                functionName: "showDescription",
                name: "Show Description",
                contextIconClass: "fas fa-scroll",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return (
                        item &&
                        !!(
                            item.system.description ||
                            item.system.notes ||
                            item.system.textReference
                        )
                    );
                },
                contextGroup: SohlContextMenu.sortGroups.General,
            },
            {
                functionName: "setupVirtualItems",
                name: "Setup Virtual Items",
                contextIconClass: "",
                contextCondition: false,
                contextGroup: SohlContextMenu.sortGroups.General,
            },
            {
                functionName: "processSiblings",
                name: "Process Siblings",
                contextIconClass: "",
                contextCondition: false,
                contextGroup: SohlContextMenu.sortGroups.General,
            },
            {
                functionName: "postProcess",
                name: "Post-Process",
                contextIconClass: "",
                contextCondition: false,
                contextGroup: SohlContextMenu.sortGroups.General,
            },
        ];
    }

    async showDescription() {
        const chatData = {
            name: this.item.name,
            subtitle: `${this.subType} ${this.constructor.typeLabel.singular}`,
            level: this.$level.effective,
            desc: this.description,
            notes: this.notes,
            textRef: this.item.system.textReference,
        };

        if (this.item.type === MysticalAbilityItemData.typeName) {
            chatData.name += ` (${this.$level.roman})`;
            chatData.subtitle = `${this.domain} ${
                this.constructor.domainLabel[this.domain] || "Domain"
            }`;
            if (this.charges.usesCharges) {
                chatData.charges = `${this.$charges.effective}`;
                if (this.$maxCharges.effective) {
                    chatData.charges += `/${this.$maxCharges}`;
                }
            }
        }

        const chatTemplate = "systems/hm/templates/chat/item-desc-card.html";

        const html = await renderTemplate(chatTemplate, chatData);

        const messageData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker(),
            content: html.trim(),
            sound: CONFIG.sounds.notification,
        };

        // Create a chat message
        return ChatMessage.create(messageData);
    }

    /**
     * Prepare base data processing.  Cannot assume the actor exists or
     * has been setup.
     */
    prepareBaseData() {
        super.prepareBaseData();

        // Construct Embedded Collections
        if (this._collections.items) delete this._collections.items;
        this.nestedItems
            .toSorted((a, b) => a.sort - b.sort)
            .forEach((ei) => {
                const item = new SohlItem(ei, {
                    nestedIn: this.item,
                    keepId: true,
                });
                if (!item) {
                    console.error(
                        `Failure to create item ${ei.name} on ${this.nestedIn.name}`,
                    );
                } else {
                    this.items.set(item.id, item);
                }
            });
    }

    /**
     * This method is the only place where it is safe to create new virtual items.
     * It runs after prepareDerivedData() has completed, and is only run for items
     * that are "owned" items or virtual items.
     *
     * The return value is the set of new items that were added to the Virtual Items list.
     */
    setupVirtualItems() {
        // Add all enabled events to the virtual items list
        this.items.forEach((it) => {
            // Transfer marked items to Actor
            this.items.forEach((it) => {
                if (it.system.transferToActor) {
                    it.cause = this.item;
                }
            });

            if (it.system instanceof EventItemData) {
                if (it.system.isEnabled) {
                    if (!it.cause) {
                        it.cause = this.item;
                    }
                } else {
                    if (
                        !it.system.activation.enabled &&
                        it.system.activation.autoStart !== "never"
                    ) {
                        it.system.start();
                        it.cause = this.item;
                    }
                }
            }
        });
    }

    /**
     * Perform processing requiring access to siblings.  It is safe to access
     * other virtual and nested items of the actor at this point.
     */
    processSiblings() {
        // Subclass provide implementation
    }

    /**
     * Final processing after all derived data has been calculated, and all
     * items have been setup.  It is safe to access other items of the actor
     * at this point.
     */
    postProcess() {
        // Subclass provide implementation
    }

    /**
     * Perform processing to check whether timers have expired
     */
    checkExpired() {
        // Subclass provide implementation
    }
}

export class AnimateEntityActorData extends SohlActorData {
    /**
     * Represents the health of a entity.
     *
     * @type {ValueModifier}
     */
    $health;

    /**
     * Represents the sum of all zones.
     *
     * @type {number}
     */
    $zoneSum;

    /**
     * Represents the base body weight of a entity without any gear
     *
     * @type {ValueModifier}
     */
    $bodyWeight;

    /**
     * Represents the level of shock the character is experiencing.
     *
     * @type {number}
     */
    $shockState;

    $fate;

    $engagedOpponents;

    $domains;

    static get typeName() {
        return "entity";
    }

    static get typeLabel() {
        return {
            singular: "Animate Entity",
            plural: "Animate Entities",
        };
    }

    static get effectKeys() {
        return Utility.simpleMerge(super.effectKeys, {
            "mod:system.$engagedOpponents": {
                label: "Engaged Opponents",
                abbrev: "EngOpp",
            },
        });
    }

    get intrinsicActions() {
        let actions = super.intrinsicActions.map((a) => {
            if (a.contextGroup === SohlContextMenu.sortGroups.Default) {
                a.contextGroup = SohlContextMenu.sortGroups.Primary;
            }
            return a;
        });

        actions.push(
            {
                functionName: "shockTest",
                name: "Shock Test",
                contextIconClass: "far fa-face-eyes-xmarks",
                contextCondition: true,
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "stumbleTest",
                name: "Stumble Test",
                contextIconClass: "far fa-person-falling",
                contextCondition: true,
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "fumbleTest",
                name: "Fumble Test",
                contextIconClass: "far fa-ball-pile",
                contextCondition: true,
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "moraleTest",
                name: "Morale Test",
                contextIconClass: "far fa-people-group",
                contextCondition: true,
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "fearTest",
                name: "Fear Test",
                contextIconClass: "far fa-face-scream",
                contextCondition: true,
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "opposedTestResume",
                name: "Opposed Test Resume",
                contextIconClass: "far fa-gears",
                contextCondition: false,
                contextGroup: SohlContextMenu.sortGroups.General,
            },
            {
                functionName: "contractTest",
                name: "Contract Affliction Test",
                contextIconClass: "fas fa-virus",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    const endurance = item?.actor?.getTraitByAbbrev("end");
                    return (
                        endurance && !endurance.system.$masteryLevel.disabled
                    );
                },
                contextGroup: SohlContextMenu.sortGroups.Default,
            },
        );

        actions.sort((a, b) => a.contextGroup.localeCompare(b.contextGroup));
        return actions;
    }

    /*--------------------------------------------------------------------------------*/
    /*        DAMAGE ROLL PROCESSING
    /*--------------------------------------------------------------------------------*/

    /**
     * Performs a damage roll, presenting a dialog
     * to collect information about the damage.
     *
     * @param {object}  rollData
     * @param {object}  [rollData.impactMod] A CombatModifier object representing the impact
     * @param {string}  [rollData.strikeModeUuid] UUID of strike mode
     * @param {number}  [numImpactTAs=0] Number of Impact Tactical Advantages
     * @param {boolean} [rollData.skipDialog=false] if true, do not display dialog
     */
    async damageRoll({
        targetToken,
        impactMod,
        bodyLocationUuid,
        skipDialog = false,
        ...options
    } = {}) {
        if (skipDialog && !impactMod) return null;

        const impactModifier = HM.sysVer.CONFIG.Helper.modifiers.ImpactModifier;
        const strikeMode =
            impactMod.parent instanceof StrikeModeItemData
                ? impactMod.parent.item
                : null;
        const bodyLocation = bodyLocationUuid
            ? await fromUuid(bodyLocationUuid)
            : null;

        const dialogOptions = {
            type: "damage",
            label: strikeMode ? `${strikeMode.name} Damage` : "Damage",
            strikeMode,
            impactMod: impactMod
                ? impactModifier.create(impactMod)
                : new impactModifier(this),
            ...options,
        };

        let roll;
        if (!impactMod || !skipDialog) {
            // Create the Roll instance
            roll = await this._damageDialog(dialogOptions);

            // If user cancelled the roll, then return immediately
            if (!roll) return null;
        } else {
            roll = {
                type: dialogOptions.type,
                impactMod: dialogOptions.impactMod,
            };
            roll.rollObj = await dialogOptions.impactMod.evaluate();
        }

        // Prepare for Chat Message
        const chatTemplate = "systems/hm/templates/chat/damage-card.html";
        const chatTemplateData = {
            title:
                dialogOptions.label +
                (targetToken ? ` to ${targetToken.name}` : ""),
            roll,
            targetToken,
            bodyLocation,
        };
        const html = await renderTemplate(chatTemplate, chatTemplateData);

        const messageData = {
            user: game.user.id,
            speaker: this.speaker,
            content: html.trim(),
            style: CONST.CHAT_MESSAGE_STYLES.ROLL,
            sound: CONFIG.sounds.dice,
            roll: roll.rollObj,
        };

        const messageOptions = {
            rollMode: game.settings.get("core", "rollMode"),
        };

        // Create a chat message
        await ChatMessage.create(messageData, messageOptions);

        return chatTemplateData;
    }

    /**
     * Renders a dialog to get the information for a damage roll, and then
     * perform processing to determine results.  Returns Roll object
     * representing outcome of die rolls, or null if user cancelled dialog.
     *
     * @param {*} dialogOptions
     */
    async _damageDialog({ type, label, strikeMode, impactMod, ...options }) {
        // Render modal dialog
        let dlgTemplate = "systems/hm/templates/dialog/damage-dialog.html";
        let dialogData = {
            type,
            strikeMode,
            weaponName: strikeMode?.name || "Non-Weapon",
            impactFormula: impactMod.label,
            impactMod,
            askImpact: !impactMod,
            addlWeaponImpact: 0,
            addlArmorReduction: 0,
            config: HM.sysVer.CONFIG,
            ...options,
        };
        const html = await renderTemplate(dlgTemplate, dialogData);

        // Create the dialog window
        return await Dialog.prompt({
            title: label,
            content: html.trim(),
            label: "Roll",
            callback: async (html) => {
                return this._damageDialogCallback(html, dialogData);
            },
            rejectClose: false,
        });
    }

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    async _damageDialogCallback(html, { type, impactMod, strikeMode }) {
        const form = html[0].querySelector("form");
        const formAddlWeaponImpact =
            Number.parseInt(form.addlWeaponImpact.value, 10) || 0;
        const formAddlArmorReduction =
            Number.parseInt(form.addlArmorReduction.value, 10) || 0;
        const newImpact = impactMod
            ? this.constructor.create(impactMod)
            : {
                  numDice: Number.parseInt(form.numDice?.value, 10) || 1,
                  die: Number.parseInt(form.impactDie?.value, 10) || 0,
                  modifier:
                      Number.parseInt(form.impactModifier?.value, 10) || 0,
                  aspect: form.impactAspect?.value || "blunt",
              };
        foundry.utils.mergeObject(newImpact, {
            extraBleedRisk: form.extraBleedRisk.checked,
            armorReduction: {
                mods: [],
            },
        });
        if (formAddlWeaponImpact) {
            newImpact.add("Player Modifier", "PlyrMod", formAddlWeaponImpact);
        }
        if (formAddlArmorReduction) {
            newImpact.armorReduction.add(
                "Player Modifier",
                "PlyrMod",
                formAddlArmorReduction,
            );
        }

        const roll = {
            type,
            impactMod: impactMod,
        };
        roll.rollObj = await impactMod.evaluate();
        return roll;
    }
    shockTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-shock-test`,
            title = `${this.item.label} Shock Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        // TODO - Shock Test
        ui.notifications.warn("Shock Test Not Implemented");
    }

    stumbleTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-stumble-test`,
            title = `${this.item.label} Stumble Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        // TODO - Stumble Test
        ui.notifications.warn("Stumble Test Not Implemented");
    }

    fumbleTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-fumble-test`,
            title = `${this.item.label} Fumble Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        // TODO - Fumble Test
        ui.notifications.warn("Fumble Test Not Implemented");
    }

    moraleTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-morale-test`,
            title = `${this.item.label} Morale Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        // TODO - Morale Test
        ui.notifications.warn("Morale Test Not Implemented");
    }

    fearTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-fear-test`,
            title = `${this.item.label} Fear Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        // TODO - Fear Test
        ui.notifications.warn("Fear Test Not Implemented");
    }

    /**
     * Resume the opposed test
     *
     * @param {object} options
     * @param {string} [options.atkItemUuid] UUID of the item the initiator is using
     * @param {number} [options.atkRollData] The attack roll data
     * @param {number} [options.atkSLMod] The Success Level modifier for the initiator
     * @returns Object containing the results of the test
     */
    async opposedTestResume(
        speaker,
        actor,
        token,
        character,
        {
            atkItemUuid,
            successLevelMod: atkSuccLvlMod,
            modifier: atkModifier,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        },
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsToken: true,
            self: this,
        }));

        // Get the attacker's item for the opposed roll
        const atkItem = fromUuidSync(atkItemUuid);

        if (!atkItem) {
            ui.notifications.error(
                `Cannot find item with UUID: ${atkItemUuid}`,
            );
            return null;
        }

        const atkMasteryLevel = ValueModifier.create(
            atkItem.system.$masteryLevel,
        );
        if (!atkMasteryLevel) {
            ui.notifications.error(
                `${atkItem.name} does not support opposed rolls, can't continue`,
            );
            return null;
        }
        atkMasteryLevel.successLevelMod = atkSuccLvlMod;
        if (atkModifier) {
            atkMasteryLevel.add("Player Modifier", "PlyrMod", atkModifier);
        }

        // Build list of acceptable opposed items on this actor
        const opposedItems = [];
        IterWrap.create(actor.allItems()).forEach((it) => {
            if (it.system instanceof MasteryLevelItemData) {
                if (!it.system.$masteryLevel.disabled) {
                    let itemTypeName =
                        it.system instanceof TraitItemData &&
                        it.system.intensity === "attribute"
                            ? "Attribute"
                            : HM.sysVer.CONFIG.Item.typeLabels[it.type];
                    if (it.system.subType) {
                        itemTypeName += ` (${it.system.subType})`;
                    }
                    opposedItems.push({
                        name: `${itemTypeName}: ${it.name} (TL:${it.system.$masteryLevel.effective})`,
                        uuid: it.uuid,
                        value: it.system.$masteryLevel,
                    });
                }
            }
        });
        opposedItems.sort((a, b) => a.localeCompare(b));

        const defaultItem = this.parent.items.find(
            (it) => it.type === atkItem.type && it.name === atkItem.name,
        );
        const defaultItemUuid = defaultItem?.uuid || opposedItems[0].uuid;

        const dialogOptions = {
            type: "opposed-test-resume",
            title: "Opposed Roll",
            opposedItems,
            opposedItemUuid: defaultItemUuid,
            mods: opposedItems[0].mods,
            label: `Complete Opposed Roll`,
            modifier: 0,
            successLevelMod: 0,
        };
        if (this.$shockState === HM.CONST.SHOCK.Stunned)
            dialogOptions.successLevelMod--;

        const dlgTemplate =
            "systems/hm/templates/dialog/opposed-response-dialog.html";
        const dlgHtml = await renderTemplate(dlgTemplate, dialogOptions);

        // Pop up the dialog to get the defender's data
        const dlgResult = await Dialog.prompt({
            title: dialogOptions.title,
            content: dlgHtml.trim(),
            label: dialogOptions.label,
            render: (html) => {
                const form = html[0].querySelector("form");
                const mods = html[0].querySelector("_mods");
                form.opposedItemUuid.addEventListener("change", () => {
                    const opposedItemUuid = form.opposedItemUuid.value;
                    const opposedItem = dialogOptions.opposedItems.find(
                        (it) => it.value === opposedItemUuid,
                    );
                    const newHtml = opposedItem.chatHtml;
                    mods.innerHTML = newHtml;
                });
            },
            callback: (html) => {
                const form = html[0].querySelector("form");
                const defModifier =
                    Number.parseInt(form.modifier.value, 10) || 0;
                const defSuccessLevelMod =
                    Number.parseInt(form.successLevelMod.value, 10) || 0;
                const opposedItemUuid = form.opposedItemUuid.value;
                const opposedItem = dialogOptions.opposedItems.find(
                    (it) => it.uuid === opposedItemUuid,
                );
                const result = {
                    value: ValueModifier.create(opposedItem.value),
                    successLevelMod: defSuccessLevelMod,
                    opposedItemUuid,
                };
                if (defModifier) {
                    result.value.add("Player Modifier", "PlyrMod", defModifier);
                }
                return result;
            },
            rejectClose: false,
        });

        // If dialog cancelled then quit
        if (!dlgResult) return null;

        // Get the defender's item for the opposed roll
        const defItem = this.getItem(dlgResult.opposedItemId);

        if (!defItem) {
            ui.notifications.error(
                `Cannot find item ${dlgResult.opposedItemId} on actor ${this.name}`,
            );
            return null;
        }

        const defItemUuid = defItem.uuid;

        let defMasteryLevel;
        if (!defItem.system.$masteryLevel) {
            ui.notifications.error(
                `${defItem.name} does not support opposed rolls, can't continue`,
            );
            return null;
        } else {
            defMasteryLevel = ValueModifier.create(
                defItem.system.$masteryLevel,
            );
        }

        defMasteryLevel.addVM(dlgResult.value, { includeBase: true });
        defMasteryLevel.successLevelMod = dlgResult.value.successLevelMod;

        // Roll for the attacker
        const atkTest = await atkMasteryLevel.test({
            type: "attacker-opposed-test",
        });

        // Roll for the defender
        const defTest = await defMasteryLevel.test({
            type: "defender-opposed-test",
        });

        return await this.opposedTestSendToChat(
            speaker,
            actor,
            token,
            character,
            {
                prevAtkResultJson: JSON.stringify(atkTest),
                prevDefResultJson: JSON.stringify(defTest),
                atkItemUuid,
                defItemUuid,
            },
        );
    }

    async opposedTestSendToChat(
        speaker,
        actor,
        token,
        character,
        // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        { prevAtkResult, prevDefResult, atkItemUuid, defItemUuid, ...scope },
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsToken: true,
            self: this,
        }));

        prevAtkResult.mlMod = JSON.parse(prevAtkResult.mlModStr);
        prevDefResult.mlMod = JSON.parse(prevDefResult.mlModStr);
        const atkItem = await fromUuid(atkItemUuid);
        const defItem = await fromUuid(defItemUuid);
        const victoryStars = this.calcVictoryStars(
            prevAtkResult.successLevel + prevAtkResult.atkFateBonus,
            prevDefResult.successLevel + prevDefResult.defFateBonus,
        );
        const atkWins = victoryStars > 0;
        const defWins = victoryStars < 0;
        const victoryStarsText = this.victoryStarsText(
            !prevAtkResult.isSuccess && !prevDefResult.isSuccess
                ? null
                : victoryStars,
        );

        // Prepare for Chat Message
        const chatTemplate =
            "systems/hm/templates/chat/opposed-result-card.html";

        const chatTemplateData = {
            title: `Opposed Roll Result`,
            prevAtkResult,
            prevDefResult,
            prevAtkResultJson: JSON.stringify(prevAtkResult),
            prevDefResultJson: JSON.stringify(prevDefResult),
            atkItem,
            defItem,
            atkItemUuid,
            defItemUuid,
            atkWins,
            defWins,
            vsText: victoryStarsText.text,
            vsisTied: victoryStarsText.isTied,
            atkVictory: victoryStarsText.isTester,
            defVictory: victoryStarsText.isOpponent,
        };

        const html = await renderTemplate(chatTemplate, chatTemplateData);

        const messageData = {
            user: game.user.id,
            speaker: this.speaker,
            content: html.trim(),
            style: CONST.CHAT_MESSAGE_STYLES.DICE,
        };

        const messageOptions = {};

        // Create a chat message
        await ChatMessage.create(messageData, messageOptions);

        return chatTemplateData;
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.$health = new ValueModifier(this, {
            max: 0,
            value: (thisVM) => thisVM.effective,
            pct: (thisVM) =>
                Math.round(
                    (thisVM.effective / (thisVM.max || Number.EPSILON)) * 100,
                ),
        });
        this.$zoneSum = 0;
        this.$isSetup = true;
        this.$shockState = HM.CONST.SHOCK.None;
        this.$engagedOpponents = new ValueModifier(this);
        this.$engagedOpponents.setBase(0);
        this.$domains = Object.fromEntries(
            Object.keys(DomainItemData.categories).map((c) => [
                c,
                new Collection(),
            ]),
        );
    }
}

// export class CharacterActorData extends LivingActorData {
//     static get typeName() {
//         return "character";
//     }

//     static get typeLabel() {
//         return {
//             singular: "Character",
//             plural: "Characters",
//         };
//     }

//     static getDefaultArtwork(data) {
//         return {
//             img: "systems/hm/images/silhouette/character-headshot.webp",
//             texture: {
//                 src: "systems/hm/images/silhouette/character-token.svg",
//             },
//         };
//     }

// export class CreatureActorData extends LivingActorData {
//     static get typeName() {
//         return "creature";
//     }

//     static get typeLabel() {
//         return {
//             singular: "Creature",
//             plural: "Creatures",
//         };
//     }

//     static getDefaultArtwork(data) {
//         return {
//             img: "systems/hm/assets/icons/claw.svg",
//             texture: {
//                 src: "systems/hm/images/silhouette/creature-token.svg",
//             },
//         };
//     }

//     static get defaultBiography() {
//         return `<h1>Data</h1>\n
//         <table style="width: 95%;" border="1">\n
//         <tbody>\n
//         <tr>\n
//         <td style="width: 143.6px;"><strong>Habitat</strong></td>\n
//         <td style="width: 432px;">&nbsp;</td>\n
//         </tr>\n
//         <tr>\n
//         <td style="width: 143.6px;"><strong>Height</strong></td>\n
//         <td style="width: 432px;">&nbsp;</td>\n
//         </tr>\n
//         <tr>\n
//         <td style="width: 143.6px;"><strong>Weight</strong></td>\n
//         <td style="width: 432px;"></td>\n
//         </tr>\n
//         <tr>\n
//         <td style="width: 143.6px;"><strong>Diet</strong></td>\n
//         <td style="width: 432px;">&nbsp;</td>\n
//         </tr>\n
//         <tr>\n
//         <td style="width: 143.6px;"><strong>Lifespan</strong></td>\n
//         <td style="width: 432px;">&nbsp;</td>\n
//         </tr>\n
//         <tr>\n
//         <td style="width: 143.6px;"><strong>Group</strong></td>\n
//         <td style="width: 432px;">&nbsp;</td>\n
//         </tr>\n
//         </tbody>\n
//         </table>\n
//         <h1>Special Abilities</h1>\n
//         <p>Describe any special attributes.</p>\n
//         <h1>Attacks</h1>\n
//         <p>Describe methods of attack.</p>\n
//         <h1>Behavior</h1>\n
//         <p>Describe behavioral aspects.</p>`;
//     }
// }

export class InanimateObjectActorData extends SohlActorData {
    static get typeName() {
        return "object";
    }

    static get typeLabel() {
        return {
            singular: "Inanimate Object",
            plural: "Inanimate Objects",
        };
    }

    /**
     * Defines the schema for a specific object by merging the schema defined by the superclass with additional properties. The resulting schema includes a capacityBase field that contains a number field with integer set to true and initial value set to 0. The merging operation is performed non-destructively by setting inplace to false.
     *
     * @static
     * @returns {*}
     */
    static defineSchema() {
        return foundry.utils.mergeObject(
            super.defineSchema(),
            {
                maxCapacity: new fields.NumberField({
                    integer: true,
                    initial: 0,
                }),
            },
            { inplace: false },
        );
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.$isSetup = true;
    }
}

function SubtypeMixin(Base) {
    return class SubtypeExtension extends Base {
        static get subTypes() {
            return new Error(`Subclasses must define subtypes`);
        }

        static defineSchema() {
            return foundry.utils.mergeObject(
                super.defineSchema(),
                {
                    subType: new fields.StringField({
                        initial: Object.keys(this.subTypes)[0],
                        blank: false,
                        label: "Sub-type",
                        choices: this.subTypes,
                    }),
                },
                { inplace: false },
            );
        }
    };
}

export class StrikeModeItemData extends SohlItemData {
    $traits;
    $assocSkill;
    $impact;
    $attack;
    $defense;

    static get effectKeys() {
        return Utility.simpleMerge(super.effectKeys, {
            "mod:system.$impact": { label: "Impact", abbrev: "Imp" },
            "mod:system.$attack": { label: "Attack", abbrev: "Atk" },
            "system.$defense.block": { label: "Block", abbrev: "Blk" },
            "system.$defense.counterstrike": {
                label: "Counterstrike",
                abbrev: "CXMod",
            },
            "system.$traits.noAttack": {
                label: "No Attack",
                abbrev: "NoAtk",
            },
            "system.$traits.noBlock": {
                label: "No Blocking",
                abbrev: "NoBlk",
            },
        });
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            mode: new fields.StringField({
                initial: "",
                label: "Mode",
                hint: "Name of the attack mode",
            }),
            minParts: new fields.NumberField({
                integer: true,
                initial: 1,
                min: 0,
                label: "Min Parts",
                hint: "Minimum number of body parts needed for this strike mode",
            }),
            assocSkillName: new fields.StringField({
                initial: "",
                label: "Assoc Skill",
                hint: "Skill that is used to perform this strike mode",
            }),
            impactBase: new fields.SchemaField({
                numDice: new fields.NumberField({
                    integer: true,
                    initial: 0,
                    min: 0,
                    label: "# of Dice",
                }),
                die: new fields.NumberField({
                    integer: true,
                    initial: 6,
                    min: 1,
                    label: "Die",
                }),
                modifier: new fields.NumberField({
                    integer: true,
                    initial: 0,
                    label: "Modifier",
                }),
                aspect: new fields.StringField({
                    initial: "blunt",
                    blank: false,
                    label: "Aspect",
                }),
            }),
        });
    }

    get intrinsicActions() {
        let actions = super.intrinsicActions.map((a) => {
            if (a.contextGroup === SohlContextMenu.sortGroups.Default) {
                a.contextGroup = SohlContextMenu.sortGroups.Primary;
            }
            return a;
        });

        actions.push(
            {
                functionName: "assistedAttackTest",
                name: "Attack Test",
                contextIconClass: "fas fa-dagger",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return item && !item.system.$attack.disabled;
                },
                contextGroup: SohlContextMenu.sortGroups.Default,
            },
            {
                functionName: "calcImpact",
                name: "Impact Roll",
                contextIconClass: "fas fa-bullseye-arrow",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return item && !item.system.$impact.disabled;
                },
                contextGroup: SohlContextMenu.sortGroups.General,
            },
        );

        actions.sort((a, b) => a.contextGroup.localeCompare(b.contextGroup));
        return actions;
    }

    assistedAttackTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-attack-test`,
            title = `${this.item.label} Attack Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        const chatResult = this.$attack.test({
            skipDialog,
            noChat,
            type,
            title,
        });

        return chatResult;
    }

    calcImpact(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-impact-roll`,
            title = `${this.item.label} Impact Roll`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        // TODO - Implement Impact Calculation
        ui.notifications.warn("Impact Calculation Not Implemented");
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$attack = new CombatModifier(this);
        this.$defense = {
            block: new CombatModifier(this),
            counterstrike: new CombatModifier(this),
        };
        this.$dodge = new CombatModifier(this);
        this.$impact = new ImpactModifier(this, {
            numDice: this.impactBase.numDice,
            aspect: this.impactBase.aspect,
            die: this.impactBase.die,
        });
        this.$impact.setBase(this.impactBase.modifier);
        this.$traits = {
            noAttack: false,
            noBlock: false,
        };
    }

    postProcess() {
        super.postProcess();
        this.$assocSkill = this.actor.getItem(this.assocSkillName, {
            types: [SkillItemData.typeName],
        });
        if (this.$assocSkill) {
            this.$attack.addVM(this.$assocSkill.system.$masteryLevel, {
                includeBase: true,
            });
            this.$attack.fate.addVM(
                this.$assocSkill.system.$masteryLevel.fate,
                {
                    includeBase: true,
                },
            );
        } else {
            this.$attack.disabled = true;
        }
        this.$dodgeSkill = this.actor.getItem("Dodge", {
            types: [SkillItemData.typeName],
        });
        if (this.$dodgeSkill) {
            this.$dodge.addVM(this.$dodgeSkill.system.$masteryLevel, {
                includeBase: true,
            });
            this.$dodge.fate.addVM(this.$assocSkill.system.$masteryLevel.fate, {
                includeBase: true,
            });
        } else {
            this.$dodge.disabled = true;
        }
    }
}

export class MeleeWeaponStrikeModeItemData extends StrikeModeItemData {
    $length;

    static get typeName() {
        return "meleestrikemode";
    }

    static get typeLabel() {
        return {
            singular: "Melee Strike Mode",
            plural: "Melee Strike Modes",
        };
    }

    static get effectKeys() {
        return Utility.simpleMerge(super.effectKeys, {
            "mod:system.$length": { label: "Length", abbrev: "Len" },
            "mod:system.$defense.block": { label: "Block", abbrev: "Blk" },
            "mod:system.$defense.counterstrike": {
                label: "Counterstrike",
                abbrev: "CX",
            },
        });
    }

    get intrinsicActions() {
        let actions = super.intrinsicActions;

        actions.push(
            {
                functionName: "assistedBlockTest",
                name: "Block Test",
                contextIconClass: "fas fa-shield",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return item && !item.system.$defense.block.disabled;
                },
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "assistedCounterstrikeTest",
                name: "Counterstrike Test",
                contextIconClass: "fas fa-swords",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return item && !item.system.$defense.counterstrike.disabled;
                },
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
        );

        actions.sort((a, b) => a.contextGroup.localeCompare(b.contextGroup));
        return actions;
    }

    assistedBlockTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-block-test`,
            title = `${this.item.label} Block Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        const chatResult = this.$defense.block.test({
            skipDialog,
            noChat,
            type,
            title,
        });

        return chatResult;
    }

    assistedCounterstrikeTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-counterstrike-test`,
            title = `${this.item.label} Counterstrike Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));
        skipDialog ??= false;
        noChat ??= false;
        type = `${this.type}-${this.name}-counterstrike-test`;
        title = `${this.item.label} Counterstrike Test`;

        const chatResult = this.$defense.counterstrike.test({
            skipDialog,
            noChat,
            type,
            title,
        });

        return chatResult;
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$length = new ValueModifier(this);
    }

    processSiblings() {
        super.processSiblings();
        // Length is only set if this Strike Mode is nested in a WeaponGear
        if (this.item.nestedIn instanceof WeaponGearItemData) {
            this.$length = this.item.nestedIn.system.lengthBase;
        }
        this.$assocSkill = this.actor.getItem(this.assocSkillName, {
            types: [SkillItemData.typeName],
        });
        if (this.$assocSkill) {
            this.$defense.block.addVM(this.$assocSkill.system.$masteryLevel, {
                includeBase: true,
            });
            this.$defense.block.fate.addVM(
                this.$assocSkill.system.$masteryLevel.fate,
                { includeBase: true },
            );
            this.$defense.counterstrike.addVM(
                this.$assocSkill.system.$masteryLevel,
                { includeBase: true },
            );
            this.$defense.counterstrike.fate.addVM(
                this.$assocSkill.system.$masteryLevel.fate,
                { includeBase: true },
            );
        } else {
            this.$attack.disabled = true;
            this.$attack.fate.disabled = true;
            this.$defense.block.disabled = true;
            this.$defense.block.fate.disabled = true;
            this.$defense.counterstrike.disabled = true;
            this.$defense.counterstrike.fate.disabled = true;
        }

        // If outnumbered, then add the outnumbered penalty to the defend "bonus" (in this case a penalty)
        if (this.outnumberedPenalty) {
            this.$defense.block.add(
                "Outnumbered",
                "OutN",
                this.outnumberedPenalty,
            );
            this.$defense.counterstrike.add(
                "Outnumbered",
                "OutN",
                this.outnumberedPenalty,
            );
        }
    }
}

export class MissileWeaponStrikeModeItemData extends StrikeModeItemData {
    static get typeName() {
        return "missilestrikemode";
    }

    static get typeLabel() {
        return {
            singular: "Missile Strike Mode",
            plural: "Missile Strike Modes",
        };
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            projectileType: new fields.StringField({
                initial: "none",
                blank: false,
                label: "Projectile Type",
                choices: ProjectileGearItemData.subTypes,
                hint: "Projectile type used by this strike mode",
            }),
        });
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.$defense.block.disabled = true;
        this.$defense.counterstrike.disabled = true;
    }
}

export class CombatTechniqueStrikeModeItemData extends StrikeModeItemData {
    $length;

    static get typeName() {
        return "combattechniquestrikemode";
    }

    static get typeLabel() {
        return {
            singular: "Combat Technique",
            plural: "Combat Techniques",
        };
    }

    static get effectKeys() {
        return Utility.simpleMerge(super.effectKeys, {
            "mod:system.defense.block": { label: "Block", abbrev: "Blk" },
            "mod:system.defense.counterstrike": {
                label: "Counterstrike",
                abbrev: "CX",
            },
        });
    }

    get intrinsicActions() {
        let actions = super.intrinsicActions
            .filter((a) => a.name !== "attack")
            .map((a) => {
                if (a.contextGroup === SohlContextMenu.sortGroups.Default) {
                    a.contextGroup = SohlContextMenu.sortGroups.Primary;
                }
                return a;
            });

        actions.push(
            {
                functionName: "assistedBlockTest",
                name: "Block Test",
                contextIconClass: "fas fa-shield",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return item && !item.system.$defense.block.disabled;
                },
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "assistedCounterstrikeTest",
                name: "Counterstrike Test",
                contextIconClass: "fas fa-swords",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return item && !item.system.$defense.counterstrike.disabled;
                },
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
        );

        actions.sort((a, b) => a.contextGroup.localeCompare(b.contextGroup));
        return actions;
    }

    assistedBlockTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-block-test`,
            title = `${this.item.label} Block Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        const chatResult = this.$defense.block.test({
            skipDialog,
            noChat,
            type,
            title,
        });

        return chatResult;
    }

    assistedCounterstrikeTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-counterstrike-test`,
            title = `${this.item.label} Counterstrike Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));
        skipDialog ??= false;
        noChat ??= false;
        type = `${this.type}-${this.name}-attack-test`;
        title = `${this.item.label} Attack Test`;

        const chatResult = this.$defense.counterstrike.test({
            skipDialog,
            noChat,
            type,
            title,
        });

        return chatResult;
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$length = new ValueModifier(this);
        this.$length.setBase(this.lengthBase);
    }

    processSiblings() {
        super.processSiblings();
        this.$assocSkill = this.actor.getItem(this.assocSkillName, {
            types: [SkillItemData.typeName],
        });
        if (this.$assocSkill) {
            this.$attack.addVM(this.$assocSkill.system.$masteryLevel, {
                includeBase: true,
            });
            this.$defense.block.addVM(this.$assocSkill.system.$masteryLevel, {
                includeBase: true,
            });
            this.$defense.counterstrike.addVM(
                this.$assocSkill.system.$masteryLevel,
                { includeBase: true },
            );
        } else {
            this.$attack.disabled = true;
            this.$defense.block.disabled = true;
            this.$defense.counterstrike.disabled = true;
        }

        // If outnumbered, then add the outnumbered penalty to the defend "bonus" (in this case a penalty)
        if (this.outnumberedPenalty) {
            this.$defense.block.add(
                "Outnumbered",
                "OutN",
                this.outnumberedPenalty,
            );
            this.$defense.counterstrike.add(
                "Outnumbered",
                "OutN",
                this.outnumberedPenalty,
            );
        }
    }
}

export class CombatManeuverItemData extends SohlItemData {
    static get typeName() {
        return "combatmaneuver";
    }

    static get typeLabel() {
        return {
            singular: "Combat Maneuver",
            plural: "Combat Maneuvers",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/sparkle.svg";
    }
}
export class MasteryLevelItemData extends SohlItemData {
    $boosts;
    $skillBase;
    $masteryLevel;

    static get effectKeys() {
        return Utility.simpleMerge(super.effectKeys, {
            "system.$boosts": { label: "Mastery Boost", abbrev: "MBoost" },
            "mod:system.$masteryLevel": {
                label: "Mastery Level",
                abbrev: "ML",
            },
            "mod:system.$masteryLevel.fate": {
                label: "Fate",
                abbrev: "Fate",
            },
            "system.$masteryLevel.successLevelMod": {
                label: "Success Level",
                abbrev: "SL",
            },
        });
    }

    get boosts() {
        return this.$boosts;
    }

    get availableFate() {
        if (this.$masteryLevel.disabled) return null;
        return (
            IterWrap.create(this.actor?.allItems()).reduce((ary, it) => {
                if (
                    it.system instanceof MysteryItemData &&
                    it.system.subType === "fate"
                ) {
                    const fateSkills = this.item.getFlag("hm", "fateSkills");
                    if (
                        !fateSkills?.length ||
                        fateSkills.includes(this.item.name)
                    ) {
                        if (it.system.$level.effective > 0) ary.push(it);
                    }
                }
                return ary;
            }, []) || []
        );
    }

    get fateBonusItems() {
        return (
            IterWrap.create(this.actor?.allItems()).reduce((ary, it) => {
                if (
                    it.system instanceof MysteryItemData &&
                    it.system.subType === "fateBonus"
                ) {
                    const skills = it.getFlag("hm", "fateSkills");
                    if (!skills || skills.includes(this.item.name)) {
                        if (
                            !it.system.$charges.disabled ||
                            it.system.$charges.effective > 0
                        ) {
                            ary.push(it);
                        }
                    }
                }
            }, []) || []
        );
    }

    get canImprove() {
        return (
            !this.item.isVirtual &&
            (game.user.isGM || this.item.isOwner) &&
            !this.$masteryLevel.disabled
        );
    }

    get valid() {
        return this.skillBase.valid;
    }

    get skillBase() {
        return this.$skillBase;
    }

    get sdrIncr() {
        return 1;
    }

    get intrinsicActions() {
        let actions = super.intrinsicActions.map((a) => {
            if (a.contextGroup === SohlContextMenu.sortGroups.Default) {
                a.contextGroup = SohlContextMenu.sortGroups.Primary;
            }
            return a;
        });

        actions = actions.concat([
            {
                functionName: "successTest",
                name: "Success Test",
                contextIconClass: "far fa-dice-d20",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return item && !item.system.$masteryLevel.disabled;
                },
                contextGroup: SohlContextMenu.sortGroups.Default,
            },
            {
                functionName: "successValueTest",
                name: "Success Value Test",
                contextIconClass: "far fa-list",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return item && !item.system.$masteryLevel.disabled;
                },
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "opposedTestStart",
                name: "Opposed Test",
                contextIconClass:
                    "fas fa-arrow-down-left-and-arrow-up-right-to-center",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    if (!item) return false;
                    const token = item.actor?.getToken();
                    return token && !item.system.$masteryLevel.disabled;
                },
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "fateTest",
                name: "Fate Test",
                contextIconClass: "fas fa-stars",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return (
                        item &&
                        !item.system.$masteryLevel.fate.disabled &&
                        item.system.availableFate.length > 0
                    );
                },
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "setImproveFlag",
                name: "Set Skill Dev Flag",
                contextIconClass: "fas fa-star",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return (
                        item &&
                        item.system.canImprove &&
                        !item.system.improveFlag
                    );
                },
                contextGroup: SohlContextMenu.sortGroups.General,
            },
            {
                functionName: "unsetImproveFlag",
                name: "Unset Skill Dev Flag",
                contextIconClass: "far fa-star",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return (
                        item &&
                        item.system.canImprove &&
                        item.system.improveFlag
                    );
                },
                contextGroup: SohlContextMenu.sortGroups.General,
            },
            {
                functionName: "improveWithXP",
                name: "Improve Mastery using XP",
                contextIconClass: "fas fa-lightbulb-on",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    if (!item || !item.system.canImprove) return false;
                    if (item.system.$masteryLevel.disabled) return false;
                    const xpItem = item.actor?.getTraitByAbbrev("xp");
                    const xpVal =
                        (xpItem &&
                            !xpItem?.system.$score?.disabled &&
                            xpItem?.system.$score.effective) ||
                        -1;
                    return xpItem && xpVal >= item.system.$masteryLevel.index;
                },
                contextGroup: SohlContextMenu.sortGroups.General,
            },
            {
                functionName: "improveWithSDR",
                name: "Improve Mastery using SDR",
                contextIconClass: "fas fa-star",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return item?.system.canImprove && item.system.improveFlag;
                },
                contextGroup: SohlContextMenu.sortGroups.General,
            },
        ]);

        actions.sort((a, b) => a.contextGroup.localeCompare(b.contextGroup));
        return actions;
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            abbrev: new fields.StringField({
                initial: "",
                label: "Abbreviation",
            }),
            skillBaseFormula: new fields.StringField({
                initial: "",
                nullable: false,
                label: "Skill Base Formula",
            }),
            masteryLevelBase: new fields.NumberField({
                initial: 0,
                min: 0,
                label: "Mastery Level",
            }),
            improveFlag: new fields.BooleanField({
                initial: false,
                label: "Flag for Mastery Improvement",
            }),
        });
    }

    setImproveFlag() {
        if (!this.improveFlag) this.item.update({ "system.improveFlag": true });
    }

    async unsetImproveFlag() {
        if (this.improveFlag)
            await this.item.update({ "system.improveFlag": false });
    }

    toggleImproveFlag() {
        if (this.improveFlag) this.unsetImproveFlag();
        else this.setImproveFlag();
    }

    /**
     * Updates the boosts value by adding the given value if the input is a number.
     *
     * @param {*} val
     */
    applyBoosts(val) {
        if (typeof val === "number") {
            this.$boosts += val;
        }
    }

    /**
     * Applies penalties to the current context
     */
    applyPenalties() {
        // Subclasses can define behaviors
    }

    /**
     * Calculates the mastery boost based on the given mastery level. Returns different boost values based on different ranges of mastery levels.
     *
     * @static
     * @param {*} ml
     * @returns {(3 | 4 | 10 | 9 | 8 | 7 | 6 | 5)}
     */
    static calcMasteryBoost(ml) {
        if (ml <= 39) return 10;
        else if (ml <= 44) return 9;
        else if (ml <= 49) return 8;
        else if (ml <= 59) return 7;
        else if (ml <= 69) return 6;
        else if (ml <= 79) return 5;
        else if (ml <= 99) return 4;
        else return 3;
    }

    /**
     * Perform Success Test for this Item
     *
     * @param {object} options
     * @returns {SuccessTestChatData}
     */
    async successTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-test`,
            title = `${this.item.label} Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        const chatResult = await this.$masteryLevel.test({
            skipDialog,
            noChat,
            type,
            title,
        });

        return chatResult;
    }

    /**
     * Perform Success Value Test for this Item.
     *
     * @param {object} options
     * @returns {SuccessTestChatData}
     */
    successValueTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-svtest`,
            title = `${this.item.label} Success Value Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        return this.$masteryLevel
            .test({
                skipDialog,
                noChat: true,
                type,
                title,
            })
            .then((chatResult) => {
                chatResult.isSuccessValue = true;
                if (!noChat) {
                    const ml = MasteryLevelModifier.fromJSON(
                        chatResult.mlModJson,
                        this,
                    );
                    ml.successTestToChat(chatResult);
                }
                return chatResult;
            });
    }

    /**
     * Perform an opposed test
     * @param {object} options
     * @returns {SuccessTestChatData}
     */
    opposedTestStart(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-opposedtest`,
            title = `${this.item.label} Opposed Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsToken: true,
            self: this,
        }));

        let target = Utility.getSingleSelectedToken({ quiet: true });
        if (!canvas.scene) {
            ui.notification.warn(`No active scene`);
        } else if (!canvas.scene.tokens.size) {
            ui.notifications.warn(`No tokens on the active scene`);
        }

        let dlgHtml = `<form id="select-token">
            <p>Select target to perform Opposed Test against:</p>
            <div class="form-group"><select name="tokenId">`;
        canvas.scene.tokens.forEach((tokdoc) => {
            dlgHtml += `<option value="${tokdoc.id}" ${
                tokdoc.id === target?.id ? "selected" : ""
            }>${tokdoc.name}`;
        });
        dlgHtml += `</select></div>
            <div class="form-group">
                <label>Situational Modifier:</label>
                <input type="number" name="modifier" value="0" />
            </div>
            <div class="form-group">
                <label>Success Level Modifier:</label>
                <input type="number" name="successLevelMod" value="0" />
            </div></form>`;
        return Dialog.prompt({
            title: "Choose Opposed Test Target",
            content: dlgHtml,
            label: "OK",
            callback: async (html) => {
                const form = html.querySelector("form");
                const fd = new FormDataExtended(form);
                const formdata = foundry.utils.expandObject(fd.object);
                target = canvas.scene.tokens.get(formdata.tokenId);
                const formModifier =
                    Number.parseInt(formdata.modifier, 10) || 0;
                let successLevelMod =
                    Number.parseInt(formdata.successLevelMod, 10) || 0;

                if (this.actor.system.shock === HM.CONST.SHOCK.Stunned)
                    successLevelMod--;

                const chatTemplate =
                    "systems/hm/templates/chat/opposed-request-card.html";

                const chatData = {
                    sourceToken: token,
                    targetToken: target,
                    testItem: this.item,
                    modifier: formModifier,
                    successLevelMod,
                };

                const chatHtml = await renderTemplate(chatTemplate, chatData);

                const messageData = {
                    user: game.user.id,
                    speaker: this.actor?.getSpeaker || ChatMessage.getSpeaker(),
                    content: chatHtml.trim(),
                    sound: CONFIG.sounds.dice,
                };

                ChatMessage.applyRollMode(messageData, "roll");

                // Create a chat message
                return ChatMessage.create(messageData);
            },
            options: { jQuery: false },
            rejectClose: false,
        });
    }

    async fateTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-fatetest`,
            title = `${this.item.label} Fate Test`,
            nextTargetUuid,
            nextAction,
            testPropName: testResultPropName,
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        // Ensure that there is fate available to be used
        const fateList = this.availableFate;
        let fateItem;
        if (fateList?.length) {
            if (fateList.length === 1) {
                fateItem = fateList[0];
            } else {
                let dlgHtml = `<form id="select-fate">
                    <p>Select which fate to use:</p>
                    <div class="form-group"><select name="fateIndex">`;
                fateList.forEach((fateItem, idx) => {
                    dlgHtml += `<option value="${idx}"}>${fateItem.name}`;
                });
                dlgHtml += `</select></div></form>`;
                fateItem = await Dialog.prompt({
                    title: "Choose Fate",
                    content: dlgHtml,
                    label: "OK",
                    callback: async (html) => {
                        const form = html.querySelector("form");
                        const fd = new FormDataExtended(form);
                        const formdata = foundry.utils.expandObject(fd.object);
                        const formIndex =
                            Number.parseInt(formdata.fateIndex, 10) || 0;
                        return fateList.at(formIndex);
                    },
                    options: { jQuery: false },
                    rejectClose: false,
                });
                if (!fateItem) return null;
            }
        } else {
            ui.notifications.warn(`No fate available to use`);
            return null;
        }
        const fateChatData = await this.$masteryLevel.fate.test({
            skipDialog,
            noChat: true,
        });

        // If user cancelled the roll, then return immediately
        if (!fateChatData) return null;

        if (fateChatData.isSuccess) {
            // If we got a critical success, then ask the player how to proceed
            if (fateChatData.isCritical) {
                const fateChoice = await Dialog.wait({
                    title,
                    content: `<p>Choose how to proceed:
                    <ol>
                    <li><strong>Free Fate:</strong> Get +1 success level bonus, but the character doesn't have to expend any fate points.</li>
                    <li><strong>Double Fate:</strong> Get +2 success level bonus, but the character must expend one fate point.</li>
                    </ol></p>`,
                    buttons: {
                        freeFate: {
                            icon: '<i class="far fa-circle-check"></i>',
                            label: "Free",
                            callback: () => "+1 Bonus, no cost",
                        },
                        doubleFate: {
                            icon: '<i class="fas fa-check-double"></i>',
                            label: "Double",
                            callback: () => "+2 Bonus, 1 Fate",
                        },
                    },
                    close: () => "freeFate",
                    default: "freeFate",
                    options: { jQuery: false },
                });

                if (fateChoice === "doubleFate") {
                    fateChatData.fateBonus = 2;
                    fateChatData.fateCost = 1;
                } else {
                    fateChatData.fateBonus = 1;
                    fateChatData.fateCost = 0;
                }
            } else {
                fateChatData.fateBonus = 1;
                fateChatData.fateCost = 1;
            }
        } else {
            fateChatData.fateBonus = 0;
            fateChatData.fateCost = fateChatData.isCritical ? 1 : 0;
        }

        // Reduce the fate level by the fate cost if any
        if (fateChatData.fateCost) {
            const newFate = Math.max(
                0,
                fateItem.system.levelBase - fateChatData.fateCost,
            );
            if (newFate !== fateItem.system.levelBase) {
                fateItem.update({ "system.levelBase": newFate });
            }
        }

        // Reduce the number of charges for each fate bonus (if any)
        this.fateBonusItems.forEach((it) => {
            if (!it.system.$charges.disabled) {
                const newCharges = Math.max(0, it.system.charges.value - 1);
                if (newCharges !== it.system.charges.value) {
                    it.update({ "system.charges.value": newCharges });
                }
            }
        });

        if (!noChat) {
            await this.$masteryLevel.fate.successTestToChat(fateChatData);
        }

        if (testResultPropName && Object.hasOwn(scope, testResultPropName)) {
            const mlMod = MasteryLevelModifier.create(
                scope[testResultPropName].mlModJson,
            );
            mlMod.successLevelMod += fateChatData.fateBonus;
            scope[testResultPropName].mlModJson = JSON.stringify(
                mlMod.toJSON(),
            );
            scope[testResultPropName].askFate = false;
            const doc = await fromUuid(nextTargetUuid);
            doc?.system.execute(nextAction, ...scope);
        }
        return fateChatData;
    }

    async improveWithSDR(speaker) {
        const updateData = { "system.improveFlag": false };
        let roll = await Roll.create("1d100 + @sb", {
            sb: this.skillBase.value,
        });
        const isSuccess = roll.total > this.$masteryLevel.base;

        if (isSuccess) {
            updateData["system.masteryLevelBase"] =
                this.masteryLevelBase + this.sdrIncr;
        }
        let prefix = `${this.constructor.subTypes[this.subType]} ${
            this.constructor.typeLabel.singular
        }`;
        const chatTemplate =
            "systems/hm/templates/chat/standard-test-card.html";
        const chatTemplateData = {
            type: `${this.type}-${this.name}-improve-sdr`,
            title: `${this.item.label} Development Roll`,
            effTarget: this.$masteryLevel.base,
            isSuccess: isSuccess,
            rollValue: roll.total,
            rollResult: roll.result,
            showResult: true,
            resultText: `${isSuccess ? "" : "No "}${prefix} Increase`,
            resultDesc: isSuccess
                ? `${this.item.label} increased by ${this.sdrIncr} to ${
                      this.$masteryLevel.base + this.sdrIncr
                  }`
                : "",
            description: isSuccess ? "Success" : "Failure",
            notes: "",
            sdrIncr: this.sdrIncr,
        };

        const html = await renderTemplate(chatTemplate, chatTemplateData);

        const messageData = {
            user: game.user.id,
            speaker,
            content: html.trim(),
            sound: CONFIG.sounds.dice,
        };

        ChatMessage.applyRollMode(messageData, "roll");

        // Create a chat message
        await ChatMessage.create(messageData);
    }

    async improveWithXP(speaker) {
        const xpItem = this.actor.getTraitByAbbrev("xp");
        if (xpItem?.system.$score.disabled) {
            ui.notifications.warn(
                "Exprience Points disabled or don't exist, cannot improve with XP",
            );
            return null;
        }
        const xpVal = xpItem.system.$score.effective || 0;
        const newXPVal = xpVal - Math.max(this.$masteryLevel.index, 1);
        if (newXPVal >= 0) {
            await this.item.update({
                "system.masteryLevelBase": this.masteryLevelBase + 1,
            });
            await xpItem.update({
                "system.textValue": String(newXPVal),
            });
            const chatTemplate = "systems/hm/templates/chat/xp-card.html";
            const chatTemplateData = {
                type: `${this.type}-${this.name}-improve-xp`,
                title: `${this.item.label} Experience Point Increase`,
                xpCost: xpVal - newXPVal,
                skillIncrease: 1,
            };

            const html = await renderTemplate(chatTemplate, chatTemplateData);

            const messageData = {
                user: game.user.id,
                speaker,
                content: html.trim(),
                sound: CONFIG.sounds.dice,
            };

            ChatMessage.applyRollMode(messageData, "roll");

            // Create a chat message
            await ChatMessage.create(messageData);
        }
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$boosts = 0;
        this.$masteryLevel = new MasteryLevelModifier(this, {
            fate: new MasteryLevelModifier(this),
        });
        this.$masteryLevel.setBase(this.masteryLevelBase);
    }

    processSiblings() {
        super.processSiblings();

        this.$skillBase ||= new SkillBase(this.skillBaseFormula, {
            items: Array.from(this.actor.allItems()),
        });

        if (this.abbrev === "fate") {
            // Fate trait itself doesn't have fate, obviously!
            this.$masteryLevel.fate.disabled = true;
        } else if (this.skillBase.attributes.includes("Aura")) {
            this.$masteryLevel.fate.set("Aura-Based, No Fate", "AurBsd", 0);
            this.$masteryLevel.fate.disabled = true;
        } else {
            const fate = this.actor.getTraitByAbbrev("fate");
            if (fate) {
                this.$masteryLevel.fate.addVM(fate.system.$masteryLevel, {
                    includeBase: true,
                });
            } else {
                this.$masteryLevel.fate.setBase(50);
            }

            this.fateBonusItems.forEach((it) => {
                this.$masteryLevel.fate.add(
                    it.label,
                    "FateBns",
                    it.system.$level.effective,
                );
            });
        }

        if (this.$masteryLevel.base > 0) {
            let newML = this.$masteryLevel.base;

            for (let i = 0; i < this.boosts; i++) {
                newML += this.constructor.calcMasteryBoost(newML);
            }

            this.$masteryLevel.setBase(newML);
        }

        // Ensure base ML is not greater than MaxML
        if (this.$masteryLevel.base > this.$masteryLevel.max) {
            this.$masteryLevel.setBase(this.$masteryLevel.max);
        }

        this.$masteryLevel.fate.disabled ||= this.$masteryLevel.disabled;

        // Apply Fate
        if (
            !this.$masteryLevel.fate.base &&
            !this.$masteryLevel.fate.disabled
        ) {
            this.$masteryLevel.fate.addVM(this.actor.system.$fate, {
                includeBase: true,
            });
            this.$masteryLevel.fate.disabled = this.actor.system.$fate.disabled;
        }
    }

    /** @override */
    postProcess() {
        super.postProcess();
        this.applyPenalties();
    }
}

export class MysteryItemData extends SubtypeMixin(SohlItemData) {
    $level;
    $charges;
    $domainLabel;
    $paramLabel;

    static get typeName() {
        return "mystery";
    }

    static get typeLabel() {
        return {
            singular: "Mystery",
            plural: "Mysteries",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/sparkles.svg";
    }

    static get effectKeys() {
        return Utility.simpleMerge(super.effectKeys, {
            "system.$charges": { label: "Charges", abbrev: "Cgs" },
            "system.$charges.max": {
                label: "Max Charges",
                abbrev: "MaxCgs",
            },
        });
    }

    static get subTypes() {
        return {
            grace: "Grace",
            piety: "Piety",
            fate: "Fate",
            fateBonus: "Fate Bonus",
            fatePointIncreaseBonus: "Fate Point Increase Bonus",
            blessing: "Blessing",
            ancestor: "Ancestor Insight",
            totem: "Totem Attunement",
        };
    }

    static get fieldName() {
        return {
            grace: "Domain",
            piety: "Domain",
            fate: "Skills",
            fateBonus: "Skills",
            fatePointIncreaseBonus: "",
            blessing: "Skills",
            ancestor: "Skills",
            totem: "Creature",
        };
    }

    get fieldData() {
        if (this.constructor.fieldName[this.subType] === "Skills") {
            if (this.skills.size) {
                return Array.from(this.skills.values())
                    .sort((a, b) => a.localeCompare(b))
                    .join(", ");
            } else {
                return "All Skills";
            }
        } else {
            if (!this.item.actor) return this.domain;
            let field;
            if (["grace", "piety"].includes(this.subType)) {
                field = this.item.actor.system.$domains.divine.get(
                    this.domain,
                )?.name;
            } else if (this.subType === "totem") {
                field = this.item.actor.system.$domains.spirit.get(
                    this.domain,
                )?.name;
            }
            return field || `Unknown (${this.domain})`;
        }
    }

    static defineSchema() {
        return foundry.utils.mergeObject(
            super.defineSchema(),
            {
                domain: new fields.StringField({
                    initial: "",
                    label: "Domain",
                }),
                skills: new fields.SetField(
                    new fields.StringField({
                        required: "true",
                        blank: false,
                        label: "Skill",
                    }),
                    { label: "Skills" },
                ),
                levelBase: new fields.NumberField({
                    integer: true,
                    initial: 0,
                    min: 0,
                    label: "Level",
                }),
                charges: new fields.SchemaField({
                    usesCharges: new fields.BooleanField({
                        initial: false,
                        label: "Uses Charges",
                    }),
                    value: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Charges",
                        hint: "Current number of charges available",
                    }),
                    // Note: if max charges is 0, then there is no maximum
                    max: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Max Charges",
                        hint: "Maximum number of charges possible",
                    }),
                }),
            },
            { inplace: false },
        );
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$label = "";
        this.$charges = new ValueModifier(this, {
            max: new ValueModifier(this),
        });
        if (!this.charges.usesCharges) {
            this.$charges.disabled = true;
            this.$charges.max.disabled = true;
        } else {
            this.$charges.setBase(this.charges.value);
            this.$charges.max.setBase(this.charges.max);
        }
        this.$level = new ValueModifier(this, {
            roman: (thisVM) => Utility.romanize(thisVM.effective),
        });
        this.$level.setBase(this.levelBase);
    }
}

export class MysticalAbilityItemData extends SubtypeMixin(
    MasteryLevelItemData,
) {
    $charges;
    $maxCharges;
    $affectedSkill;
    $fatigue;
    $level;

    static get typeName() {
        return "mysticalability";
    }

    static get typeLabel() {
        return {
            singular: "Mystical Ability",
            plural: "Mystical Abilities",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/hand-sparkles.svg";
    }

    static get effectKeys() {
        return Utility.simpleMerge(super.effectKeys, {
            "system.$charges": { label: "Charges", abbrev: "Cgs" },
            "system.$charges.max": {
                label: "Max Charges",
                abbrev: "MaxCgs",
            },
        });
    }

    static get subTypes() {
        return {
            energy: "Energy Spirit Power",
            ceremony: "Ritual Ceremony",
            festival: "Ritual Festival",
            ordeal: "Ritual Ordeal",
            devotion: "Ritual Devotion",
            alchemy: "Alchemy",
            divination: "Divination",
            arcaneincantation: "Arcane Incantation",
            arcaneinvocation: "Arcane Invocation",
            divineincantation: "Divine Incantation",
            arcanetalent: "Arcane Talent",
        };
    }

    static get actionLabel() {
        return {
            energy: "Manipulate Element",
            ceremony: "Perform Benediction",
            festival: "Perform Benediction",
            ordeal: "Complete Ordeal",
            devotion: "Perform Ritual Devotion",
            divination: "Perform Divination",
            arcaneincantation: "Cast Spell",
            arcaneinvocation: "Invoke Arcane Effect",
            divineincantation: "Beseech Divine Aid",
            arcanetalent: "Perform Arcane Talent",
        };
    }

    static get improvableSubTypes() {
        return ["arcaneincantation", "arcanetalent"];
    }

    static get domainLabel() {
        return {
            energy: "Element",
            ceremony: "Ritual",
            festival: "Ritual",
            ordeal: "Domain",
            devotion: "Ritual",
            foretelling: "Skill",
            arcaneincanting: "Domain",
            arcaneinvocation: "Domain",
            divineincanting: "Ritual",
            arcanetalent: "Domain",
        };
    }

    static get energySpiritPowerTypes() {
        return {
            air: "Air",
            earth: "Earth",
            water: "Water",
            fire: "Fire",
        };
    }

    static get domainDegree() {
        return {
            primary: { name: "Primary", value: 0 },
            secondary: { name: "Secondary", value: 1 },
            neutral: { name: "Neutral", value: 2 },
            tertiary: { name: "Tertiary", value: 3 },
            diametric: { name: "Diametric", value: 4 },
        };
    }

    get availableFate() {
        // All of the Mystical Abilities are essentially aura based, so none of them
        // may be Fated.
        return false;
    }

    /**
     * Returns whether this item can be improved by using a mystical ability.
     * Returns true if the subType of the item is one of the following: ArcaneInvocation, DivineInvocation, or ArcaneTalent.
     * Returns false otherwise.
     *
     * @readonly
     * @type {*}
     */
    get canImprove() {
        const result =
            super.canImprove &&
            this.constructor.improvableSubTypes.includes(this.subType);
        return result;
    }

    /**
     * Defines the schema for a specific entity. This function merges the base schema with additional fields including domain, level, and charges. Each field has its own specifications such as type, initial value, min value, and additional properties for charges. The function returns the merged schema object with the added fields.
     *
     * @static
     * @returns {*}
     */
    static defineSchema() {
        return foundry.utils.mergeObject(
            super.defineSchema(),
            {
                domain: new fields.StringField({
                    initial: "",
                    label: "Domain",
                }),
                levelBase: new fields.NumberField({
                    integer: true,
                    initial: 0,
                    min: 0,
                    label: "Level",
                }),
                charges: new fields.SchemaField({
                    usesCharges: new fields.BooleanField({
                        initial: false,
                        label: "Uses Charges",
                    }),
                    value: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Charges",
                        hint: "Current number of charges available",
                    }),
                    // Note: if max charges is 0, then there is no maximum
                    max: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Max Charges",
                        hint: "Maximum number of charges possible",
                    }),
                }),
            },
            { inplace: false },
        );
    }

    get intrinsicActions() {
        let actions = super.intrinsicActions.map((a) => {
            if (a.contextGroup === SohlContextMenu.sortGroups.Default) {
                a.contextGroup = SohlContextMenu.sortGroups.Primary;
            }
            return a;
        });

        actions.push({
            functionName: "perform",
            name: `Perform ${this.constructor.subTypes[this.subType]}`,
            contextIconClass: "far fa-bullseye",
            contextCondition: (header) => {
                header = header instanceof HTMLElement ? header : header[0];
                const li = header.closest(".item");
                const item = fromUuidSync(li.dataset.uuid);
                return item && !item.system.$masteryLevel.disabled;
            },
            contextGroup: SohlContextMenu.sortGroups.Default,
        });

        actions.sort((a, b) => a.contextGroup.localeCompare(b.contextGroup));
        return actions;
    }

    perform(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-perform`,
            title = `${this.item.label} Perform`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));
        // TODO - Mystical Ability Perform
        ui.notifications.warn("Mystical Ability Perform Not Implemented");
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$charges = new ValueModifier(this, {
            max: new ValueModifier(this),
        });
        if (!this.charges.usesCharges) {
            this.$charges.disabled = true;
            this.$charges.max.disabled = true;
        } else {
            this.$charges.setBase(this.charges.value);
            this.$charges.max.setBase(this.charges.max);
        }
        this.$level = new ValueModifier(this, {
            roman: (thisVM) => Utility.romanize(thisVM.effective),
        });
        this.$level.setBase(this.levelBase);
        this.$fatigue = new ValueModifier(this);
        this.$fatigue.setBase(this.fatigueBase);
    }

    setupVirtualItems() {
        super.setupVirtualItems();
        const domain = this.domain.trim();
        if (this.subType === "ancestor" && domain) {
            /*
             * Ancestor Spirit Powers are granted as bonuses to a particular skill, whose name
             * is in the "domain" field.  We expect that such a skill must be currently available
             * as a owned item on the Actor.  If for some reason that is not the case, then we
             * we need to create a virtual skill item for that particular skill.
             */
            this.$affectedSkill = IterWrap.create(this.actor.allItems()).find(
                (it) =>
                    it.system instanceof SkillItemData && it.name === domain,
            );

            if (!this.$affectedSkill) {
                // The skill doesn't exist, so we need to create a stand-in skill for it.  This skill
                // will be set to ML 0.  If there is a skill already in the nested items with the exact same
                // name as requested, then we will use that as a template for the skill.
                const item = this.items.find(
                    (it) =>
                        it.system instanceof SkillItemData &&
                        it.name === domain,
                );
                let itemData = item?.toObject();

                if (!itemData) {
                    // Couldn't find the named skill in the nested items, so
                    // create a new one from scratch.
                    itemData = {
                        name: domain,
                        type: SkillItemData.typeName,
                    };
                }

                itemData._id = foundry.utils.randomID();

                // Ensure that ML is set to 0
                foundry.utils.setProperty(
                    itemData,
                    "system.masteryLevelBase",
                    0,
                );

                // Create a new pure virtual skill as a stand-in for the missing skill
                this.$affectedSkill = new SohlItem(itemData, {
                    parent: this.actor,
                    cause: this.item,
                });
            }
        }
    }

    /** @override */
    postProcess() {
        super.postProcess();
        if (this.subType === "ancestor") {
            if (this.$affectedSkill) {
                const ml = this.$affectedSkill.system.$masteryLevel;
                let numBoosts = this.$level.effective;
                if (!ml.base) {
                    ml.setBase(this.$affectedSkill.system.skillBase.value);
                    numBoosts--;
                }
                if (numBoosts)
                    this.$affectedSkill.system.applyBoosts(numBoosts);
            }
        }
    }
}

export class DomainItemData extends SohlItemData {
    static get typeName() {
        return "domain";
    }

    static get typeLabel() {
        return {
            singular: "Domain",
            plural: "Domains",
        };
    }

    static get categories() {
        return {
            arcane: "Arcane",
            divine: "Divine",
            spirit: "Spirit",
            astral: "Astral",
            natural: "Natural",
        };
    }

    get categoriesLabel() {
        return Array.from(this.categories.values()).sort().join(", ");
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/sparkle.svg";
    }

    static defineSchema() {
        return foundry.utils.mergeObject(
            super.defineSchema(),
            {
                categories: new fields.SetField(
                    new fields.StringField({
                        required: "true",
                        blank: false,
                        label: "Category",
                        choices: DomainItemData.categories,
                    }),
                    { label: "Categories" },
                ),
                abbrev: new fields.StringField({
                    initial: "",
                    label: "Abbreviation",
                }),
                philosophy: new fields.StringField({
                    initial: "",
                    label: "Philosophy",
                }),
            },
            { inplace: false },
        );
    }

    processSiblings() {
        super.processSiblings();

        // Load up the domain lists
        this.categories.forEach((c) => {
            this.actor.system.$domains[c] ??= new Collection();
            this.actor.system.$domains[c].set(this.abbrev, this);
        });
    }
}

export class InjuryItemData extends SohlItemData {
    $healingRate;
    $bleeding;
    $injuryLevel;

    static get typeName() {
        return "injury";
    }

    static get typeLabel() {
        return {
            singular: "Injury",
            plural: "Injuries",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/injury.svg";
    }

    static get aspectTypes() {
        return {
            blunt: "Blunt",
            edged: "Edged",
            piercing: "Piercing",
            fire: "Fire",
        };
    }

    static get effectKeys() {
        return Utility.simpleMerge(super.effectKeys, {
            "system._healingRate": { label: "Healing Rate", abbrev: "HR" },
            "system._injuryLevel": {
                label: "Injury Level",
                abbrev: "InjLvl",
            },
        });
    }

    static get injuryLevels() {
        return ["NA", "M1", "S2", "S3", "G4", "G5"];
    }

    static get eventTags() {
        return foundry.utils.mergeObject(
            super.eventTags,
            {
                nextHealingCheck: "Next Healing Check",
            },
            { inplace: false },
        );
    }

    get created() {
        return this.getEvent("created")?.system;
    }

    get nextHealingCheck() {
        return this.getEvent("nextHealingCheck")?.system;
    }

    get untreatedHealing() {
        return {
            hr: 4,
            infect: true,
            impair: false,
            bleed: false,
            newInj: -1,
        };
    }

    static defineSchema() {
        return foundry.utils.mergeObject(
            super.defineSchema(),
            {
                injuryLevelBase: new fields.NumberField({
                    integer: true,
                    initial: 0,
                    min: 0,
                    label: "Injury Level",
                }),
                healingRateBase: new fields.NumberField({
                    integer: true,
                    initial: 0,
                    min: 0,
                    label: "Healing Rate",
                }),
                aspect: new fields.StringField({
                    initial: "blunt",
                    blank: false,
                    label: "Aspect",
                    choices: InjuryItemData.aspectTypes,
                }),
                isTreated: new fields.BooleanField({
                    initial: false,
                    label: "Treated",
                }),
                isBleeding: new fields.BooleanField({
                    initial: false,
                    label: "Bleeding",
                }),
                bodyLocation: new fields.StringField({
                    initial: "",
                    label: "Body Location",
                }),
            },
            { inplace: false },
        );
    }

    get intrinsicActions() {
        let actions = super.intrinsicActions.map((a) => {
            if (a.contextGroup === SohlContextMenu.sortGroups.Default) {
                a.contextGroup = SohlContextMenu.sortGroups.Primary;
            }
            return a;
        });

        actions.push(
            {
                functionName: "bleedingStoppageTest",
                name: "Bleeding Stoppage Test",
                contextIconClass: "fas fa-droplet-slash",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    if (!item?.system.isBleeding) return false;
                    const physician = item?.actor?.getSkillByAbbrev("pysn");
                    return (
                        physician && !physician.system.$masteryLevel.disabled
                    );
                },
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "bloodLossAdvanceTest",
                name: "Blood Loss Advance Test",
                contextIconClass: "fas fa-droplet",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    if (!item || !item.system.isBleeding) return false;
                    const strength = item?.actor?.getTraitByAbbrev("str");
                    return strength && !strength.system.$masteryLevel?.disabled;
                },
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "treatmentTest",
                name: "Treatment Test",
                contextIconClass: "fas fa-staff-snake",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    if (item?.system.isBleeding) return false;
                    const physician = item?.actor?.getSkillByAbbrev("pysn");
                    return (
                        physician && !physician.system.$masteryLevel.disabled
                    );
                },
                contextGroup: SohlContextMenu.sortGroups.Default,
            },
            {
                functionName: "healTest",
                name: "Heal Test",
                contextIconClass: "fas fa-heart-pulse",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    if (item?.system.isBleeding) return false;
                    const endurance = item?.actor?.getTraitByAbbrev("end");
                    return (
                        endurance && !endurance.system.$masteryLevel.disabled
                    );
                },
                contextGroup: SohlContextMenu.sortGroups.Default,
            },
        );

        actions.sort((a, b) => a.contextGroup.localeCompare(b.contextGroup));
        return actions;
    }

    treatmentTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-treatment-test`,
            title = `${this.item.label} Treatment Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsToken: true,
            self: this,
        }));

        // TODO - Injury Treatment Test
        ui.notifications.warn("Injury Treatment Test Not Implemented");
    }

    healTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-heal-test`,
            title = `${this.item.label} Heal Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        // TODO - Injury Heal Test
        ui.notifications.warn("Injury Heal Test Not Implemented");
    }

    bleedingStoppageTest(
        speaker = null,
        actor = null,
        token = null,
        character = null,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-bleed-stop-test`,
            title = `${this.item.label} Bleeding Stoppage Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        },
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
        }));

        // TODO - Injury Bleeding Stoppage Test
        ui.notifications.warn("Injury Bleeding Stoppage Test Not Implemented");
    }

    bloodlossAdvanceTest(
        speaker = null,
        actor = null,
        token = null,
        character = null,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-bloodloss-advance-test`,
            title = `${this.item.label} Bloodloss Advance Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        },
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
        }));

        // TODO - Injury Bloodloss Advance Test
        ui.notifications.warn("Injury Bloodloss Advance Test Not Implemented");
    }

    /** @override */
    async _preCreate(data, options, user) {
        const allowed = await super._preCreate(data, options, user);
        if (!allowed) return false;

        // Create a new event to represent the create time of the injury
        const createdItem = await SohlItem.create({
            name: "Created",
            type: "event",
            system: {
                tag: "created",
                activation: {
                    scope: "self",
                    initTime: game.time.worldTime,
                    oper: "indefinite",
                },
            },
        });

        const updateData = {
            nestedItems: this.nestedItems.concat(createdItem.toObject()),
        };

        if (!Object.hasOwn(options, "healTestDuration")) {
            options.healTestDuration = game.settings.get(
                "hm",
                "healingSeconds",
            );
        }

        if (options.healTestDuration) {
            // Create a new event to represent the next heal test
            const nextHealTest = await SohlItem.create({
                name: "Next Heal Test",
                type: "event",
                system: {
                    tag: "nextHealingCheck",
                    actionName: "healTest",
                    activation: {
                        scope: "item",
                        initTime: game.time.worldTime,
                        duration: options.healTestDuration,
                        oper: "duration",
                    },
                },
            });
            updateData["nestedItems"].push(nextHealTest);
        }

        await this.updateSource(updateData);
        return true;
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();

        this.$healingRate = new ValueModifier(this);
        this.$injuryLevel = new ValueModifier(this, {
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            severity: (thisVM) => {
                return "0";
            },
        });

        this.$injuryLevel.setBase(this.injuryLevelBase);
        this.$healingRate.setBase(
            this.isTreated ? this.healingRateBase : this.untreatedHealing.hr,
        );
    }

    postProcess() {
        super.postProcess();
        if (this.$healingRate.effective <= 0) this.$healingRate.disabled;
    }
}

export class AfflictionItemData extends SubtypeMixin(SohlItemData) {
    $healingRate;
    $contagionIndex;
    $level;

    static AFFLICTON_DEFEATED_HR = 6;
    static SUBJECT_DEAD_HR = 0;
    static UNDEFINED_HR = -1;

    static get typeName() {
        return "affliction";
    }

    static get typeLabel() {
        return {
            singular: "Affliction",
            plural: "Afflictions",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/sick.svg";
    }

    static get subTypes() {
        return {
            privation: "Privation",
            fatigue: "Fatigue",
            disease: "Disease",
            infection: "Infection",
            poisontoxin: "Poison/Toxin",
            fear: "Fear",
            morale: "Morale",
            shadow: "Shadow",
        };
    }

    static get subTypeAbbreviation() {
        return {
            privation: "Prv",
            fatigue: "Fatg",
            disease: "Disz",
            infection: "Inft",
            poisontoxin: "PsnTxn",
            fear: "Fear",
            morale: "Morl",
            shadow: "Shdw",
        };
    }
    static get transmissionTypes() {
        return {
            none: "Noncommunicable",
            airborne: "Airborne",
            contact: "Contact",
            bodyfluid: "Body Fluid",
            injested: "Injested",
            proximity: "Proximity",
            vector: "Vector",
            perception: "Perception",
            arcane: "Arcane",
            divine: "Divine",
            spirit: "Spirit",
        };
    }

    static defineSchema() {
        return foundry.utils.mergeObject(
            super.defineSchema(),
            {
                isDormant: new fields.BooleanField({
                    initial: false,
                    label: "Dormant",
                    hint: "Doesn't affect carrier, but may be contagious or reactivate",
                }),
                isTreated: new fields.BooleanField({
                    initial: false,
                    label: "Treated",
                }),
                diagnosisBonusBase: new fields.NumberField({
                    integer: true,
                    initial: 0,
                    label: "Diagnosis Bonus",
                    hint: "Modifier to treatment test from diagnosis",
                }),
                levelBase: new fields.NumberField({
                    integer: true,
                    initial: 0,
                    min: 0,
                    label: "Level",
                    hint: "Magnitude of Affliction",
                }),
                healingRateBase: new fields.NumberField({
                    integer: true,
                    initial: this.UNDEFINED_HR,
                    min: this.UNDEFINED_HR,
                    label: "Healing Rate",
                    hint: "Virulence of Affliction",
                }),
                contagionIndexBase: new fields.NumberField({
                    integer: true,
                    initial: 0,
                    min: 0,
                    label: "Contagion Index",
                }),
                transmission: new fields.StringField({
                    initial: "none",
                    blank: false,
                    label: "Transmission",
                    choices: this.transmissionTypes,
                }),
            },
            { inplace: false },
        );
    }

    get intrinsicActions() {
        let actions = super.intrinsicActions.map((a) => {
            if (a.contextGroup === SohlContextMenu.sortGroups.Default) {
                a.contextGroup = SohlContextMenu.sortGroups.Primary;
            }
            return a;
        });

        actions.push(
            {
                functionName: "transmit",
                name: "Transmit Affliction",
                contextIconClass: "fas fa-viruses",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return item?.system.canTransmit;
                },

                contextGroup: SohlContextMenu.sortGroups.Default,
            },
            {
                functionName: "courseTest",
                name: "Course Test",
                contextIconClass: "fas fa-heart-pulse",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    if (item.system.isDormant) return false;
                    const endurance = item?.actor?.getTraitByAbbrev("end");
                    return (
                        endurance && !endurance.system.$masteryLevel.disabled
                    );
                },
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "diagnosisTest",
                name: "Diagnosis Test",
                contextIconClass: "fas fa-stethoscope",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return item && !item.system.isTreated;
                },
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "treatmentTest",
                name: "Treatment Test",
                contextIconClass: "fas fa-staff-snake",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    return item && !item.system.isTreated;
                },
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
            {
                functionName: "healingTest",
                name: "Healing Test",
                contextIconClass: "fas fa-heart-pulse",
                contextCondition: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const item = fromUuidSync(li.dataset.uuid);
                    if (item?.system.$healingRate.disabled) return false;
                    const endurance = item?.actor?.getTraitByAbbrev("end");
                    return (
                        endurance && !endurance.system.$masteryLevel.disabled
                    );
                },
                contextGroup: SohlContextMenu.sortGroups.Primary,
            },
        );

        actions.sort((a, b) => a.contextGroup.localeCompare(b.contextGroup));
        return actions;
    }

    get canTransmit() {
        return true;
    }

    get canContract() {
        return true;
    }

    get hasCourse() {
        return true;
    }

    get canTreat() {
        return true;
    }

    get canHeal() {
        return true;
    }

    transmit(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-transmit`,
            title = `${this.item.label} Transmit`,
            target = null,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsToken: true,
            self: this,
        }));
        // TODO - Affliction Transmit
        ui.notifications.warn("Affliction Transmit Not Implemented");
    }

    contractTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-contract-test`,
            title = `${this.item.label} Contract Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        // TODO - Affliction Contract Test
        ui.notifications.warn("Affliction Contract Test Not Implemented");
    }

    courseTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-course-test`,
            title = `${this.item.label} Course Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        // TODO - Affliction Course Test
        ui.notifications.warn("Affliction Course Test Not Implemented");
    }

    diagnosisTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-treatment-test`,
            title = `${this.item.label} Treatment Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsToken: true,
            self: this,
        }));

        // TODO - Affliction Diagnosis Test
        ui.notifications.warn("Affliction Diagnosis Test Not Implemented");
    }

    treatmentTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-treatment-test`,
            title = `${this.item.label} Treatment Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsToken: true,
            self: this,
        }));

        // TODO - Affliction Treatment Test
        ui.notifications.warn("Affliction Treatment Test Not Implemented");
    }

    healingTest(
        speaker,
        actor,
        token,
        character,
        {
            skipDialog = false,
            noChat = false,
            type = `${this.type}-${this.name}-healing-test`,
            title = `${this.item.label} Healing Test`,
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            ...scope
        } = {},
    ) {
        ({ speaker, actor, token, character } = SohlMacro.getExecuteDefaults({
            speaker,
            actor,
            token,
            character,
            needsActor: true,
            self: this,
        }));

        // TODO - Affliction Healing Test
        ui.notifications.warn("Affliction Healing Test Not Implemented");
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$healingRate = new ValueModifier(this);
        if (this.healingRateBase === -1) this.$healingRate.disabled = true;
        else this.$healingRate.setBase(this.healingRateBase);
        this.$contagionIndex = new ValueModifier(this).setBase(
            this.contagionIndexBase,
        );
        this.$level = new ValueModifier(this).setBase(this.levelBase);
    }
}

export class TraitItemData extends SubtypeMixin(MasteryLevelItemData) {
    $valueDesc;
    $score;

    static get typeName() {
        return "trait";
    }

    static get typeLabel() {
        return {
            singular: "Trait",
            plural: "Traits",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/user-gear.svg";
    }

    static get subTypes() {
        return {
            physique: "Physique",
            personality: "Personality",
            transcendent: "Transcendent",
        };
    }

    static get intensities() {
        return {
            trait: "Trait",
            impulse: "Impulse",
            disorder: "Disorder",
            attribute: "Attribute",
        };
    }

    static get effectKeys() {
        return Utility.simpleMerge(super.effectKeys, {
            "system.score": { label: "Score", abbrev: "Scor" },
            "system.$masteryLevel": { label: "Value", abbrev: "Val" },
            "system.textValue": { label: "Text", abbrev: "Text" },
        });
    }

    get displayVal() {
        let result = this.textValue;
        if (this.isNumeric) {
            result = this.$score.displayVal;
        } else if (this.choices[this.textValue]) {
            result = this.choices[this.textValue];
        }
        return result;
    }

    get intrinsicActions() {
        if (this.intensity === "attribute" && this.isNumeric) {
            return super.intrinsicActions;
        } else {
            // If this is not a numeric attribute, then targetlevel is
            // actually not used, so don't include its intrinsic actions
            // and instead use the intrinsic actions for SohlItemData.
            return SohlItemData.prototype.intrinsicActions;
        }
    }

    /**
     * abbrev: short abbreviation for this trait
     * textValue: the value of this trait.  Boolean and numeric values
     *     are coerced into strings.
     * max: for numeric values, this represents the maximum value of
     *     the trait.  Not applicable to any other type.
     * isNumeric: whether the textValue should be evaluated as a number
     * intensity: the severity of the trait.  If set to "attribute", the
     *     trait is instead considered to be an attribute.
     * actionBodyParts: Which body part impairments apply to this
     *     trait. A value of "Any" indicates all body parts affect
     *     this trait.
     * valueDesc: an array defining labels describing the values of this
     *     trait.  Only applicable to numeric traits.
     * choices: A set of values representing valid choices for this trait.
     *     The textValue should be one of these choice values.
     *
     * @override
     */
    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            textValue: new fields.StringField({
                initial: "",
                label: "Value",
            }),
            max: new fields.NumberField({
                integer: true,
                nullable: true,
                initial: null,
                label: "Maximum value",
            }),
            isNumeric: new fields.BooleanField({
                initial: false,
                label: "Is Numeric",
                hint: "Is value numeric",
            }),
            intensity: new fields.StringField({
                initial: "trait",
                blank: false,
                label: "Intensity",
                choices: this.intensities,
            }),
            valueDesc: new fields.ArrayField(
                new fields.SchemaField({
                    label: new fields.StringField({
                        initial: "",
                        label: "Value Label",
                    }),
                    maxValue: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        label: "The highest attribute value where this label applies",
                    }),
                }),
            ),
            choices: new fields.ObjectField({
                label: "Choices",
            }),
        });
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$valueDesc = this.valueDesc
            .concat()
            .sort((a, b) => a.maxValue - b.maxValue);
        this.$score = new ValueModifier(this, {
            valueDesc: (thisVM) => {
                let desc = "";
                const len = this.$valueDesc.length;
                for (let i = 0; !desc && i < len; i++) {
                    if (thisVM.effective <= this.$valueDesc[i].maxValue) {
                        desc = this.$valueDesc[i].label;
                        break;
                    }
                }
                return desc;
            },
            max: this.max,
            displayVal: (thisVM) => {
                let result = thisVM.effective;
                const traitDesc = thisVM.valueDesc;
                if (traitDesc) result += ` (${traitDesc})`;
                if (typeof thisVM.max === "number") {
                    result += ` [max: ${thisVM.max}]`;
                }
                return result;
            },
        });

        if (this.isNumeric) {
            const scoreVal = Number.parseInt(this.textValue, 10);
            this.$score.setBase(scoreVal);
            if (this.intensity === "attribute") {
                this.$masteryLevel.disabled = false;
                this.$masteryLevel.fate.disabled = false;
                this.$masteryLevel.setBase(scoreVal * 5);
            }
            this.$skillBase = new SkillBase(this.skillBaseFormula, [this]);
        } else {
            this.$score.disabled = true;
            this.$masteryLevel.disabled = true;
            this.$masteryLevel.fate.disabled = true;
        }
    }

    /** @override */
    postProcess() {
        super.postProcess();
        if (this.intensity === "attribute") {
            // Various conditions (e.g., spells) can change the attribute score.
            // If the score has been modified, then update
            // all of the skills depending on that score in their SB formula.
            if (this.$score.modifier) {
                const newBase = Math.max(
                    0,
                    Math.trunc(this.$score.effective) * 5,
                );
                this.$masteryLevel.setBase(newBase);

                // For each occurrence of an attribute in the SB Formula, increase the ML
                // by 5 x the score difference from the base score.
                IterWrap.create(this.actor.allItems()).forEach((it) => {
                    if (it.system instanceof MasteryLevelItemData) {
                        const attributes = it.system.skillBase.attributes;
                        if (attributes.includes(this.item.name)) {
                            const numOccurances = attributes.filter(
                                (a) => a === this.item.name,
                            ).length;
                            it.system.$masteryLevel.add(
                                `${this.item.name} Increase`,
                                `${this.abbr}Inc`,
                                this.$score.modifier * numOccurances * 5,
                            );
                        }
                    }
                });
            }
        } else {
            this.$masteryLevel.disabled = true;
        }
    }
}

export class SkillItemData extends SubtypeMixin(MasteryLevelItemData) {
    static get typeName() {
        return "skill";
    }

    static get typeLabel() {
        return {
            singular: "Skill",
            plural: "Skills",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/head-gear.svg";
    }

    /** @enum */
    static get subTypes() {
        return {
            social: "Social",
            nature: "Nature",
            craft: "Craft",
            lore: "Lore",
            language: "Language",
            script: "Script",
            ritual: "Ritual",
            physical: "Physical",
            combat: "Combat",
            esoteric: "Esoteric",
        };
    }

    /** @enum */
    static get combatTypes() {
        return {
            none: "None",
            all: "All Weapon Types",
            melee: "Melee",
            missile: "Missile",
            meleemissile: "Melee & Missile",
            maneuver: "Combat Maneuver",
            meleemaneuver: "Melee & Combat Maneuver",
        };
    }

    /**
     * weaponGroup: the type of combat weapon this skill applies to
     * actionBodyParts: Which body part impairments apply to this
     *     skill. A value of "Any" indicates all body parts affect
     *     this skill.
     *
     * @override
     */
    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            weaponGroup: new fields.StringField({
                initial: "none",
                blank: false,
                label: "Weapon Group",
                choices: this.combatTypes,
            }),
            baseSkill: new fields.StringField({
                initial: "",
                label: "Base Skill",
                hint: "If this is a specialization, then the name of the base skill, otherwise blank",
            }),
            domain: new fields.StringField({
                initial: "",
                label: "Domain",
                hint: "Domain associated with this skill, if any",
            }),
        });
    }
}

export class AffiliationItemData extends SohlItemData {
    static get typeName() {
        return "affiliation";
    }

    static get typeLabel() {
        return {
            singular: "Affiliation",
            plural: "Affiliations",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/people-group.svg";
    }

    static defineSchema() {
        return foundry.utils.mergeObject(
            super.defineSchema(),
            {
                society: new fields.StringField({
                    initial: "",
                    label: "Society",
                }),
                office: new fields.StringField({
                    initial: "",
                    label: "Office",
                }),
                title: new fields.StringField({
                    initial: "",
                    label: "Title",
                }),
                level: new fields.NumberField({
                    integer: true,
                    initial: 0,
                    min: 0,
                    label: "Level",
                }),
            },
            { inplace: false },
        );
    }
}

export class AnatomyItemData extends SohlItemData {
    $sum;
    $defaultAim;

    static get typeName() {
        return "anatomy";
    }

    static get typeLabel() {
        return {
            singular: "Anatomy",
            plural: "Anatomies",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/person.svg";
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            defaultAim: new fields.StringField({
                initial: "",
                label: "Default Aim",
            }),
            weaponLimbs: new fields.SetField(
                new fields.StringField({
                    initial: "",
                    label: "Weapon Limb",
                }),
                {
                    label: "Weapon Limbs",
                },
            ),
        });
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.$defaultAim = this.defaultAim;
        this.$sum = {};
    }

    /** @override */
    postProcess() {
        super.postProcess();

        // Ensure our defaultAim is one of the defined aim locations;
        // Otherwise, arbitrarily choose the first aim location as the
        // default one.
        if (!Object.hasOwn(this.$sum, this.$defaultAim)) {
            this.$defaultAim = Object.keys(this.$sum).at(0) ?? "";
        }
    }
}

export class BodyZoneItemData extends SohlItemData {
    $aim;
    $bodyParts;

    static get typeName() {
        return "bodyzone";
    }

    static get typeLabel() {
        return {
            singular: "Body Zone",
            plural: "Body Zones",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/person.svg";
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            abbrev: new fields.StringField({
                initial: "",
                label: "Abbreviation",
            }),
            aim: new fields.ArrayField(
                new fields.SchemaField(
                    {
                        name: new fields.StringField({
                            initial: "",
                            label: "Area Name",
                            name: "Area location name",
                        }),
                        probWeightBase: new fields.NumberField({
                            integer: true,
                            initial: 0,
                            min: 0,
                            label: "Area Probability Weight",
                            hint:
                                "The ratio of how often this body " +
                                "zone is hit compared to all body zones " +
                                "in the same area",
                        }),
                    },
                    {
                        label: "Aim",
                    },
                ),
            ),
        });
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$aim = {};
        this.$bodyParts = [];
    }

    processSiblings() {
        super.processSiblings();

        // Body Zone Items should never show up under the actor's "owned" items, they should always be
        // virtual items nested within an Anatomy item.  But let's just ensure that if this is not the
        // case we abandon processing immediately.
        if (this.actor && !this.item.isNested) {
            console.warn(
                `Item ${this.uuid} is a BodyZone that is not nested in an Anatomy, please correct this`,
            );
        }

        const anatomyData = this.item.cause.system;
        this.aim.forEach((aim) => {
            anatomyData.$sum[aim.name] += aim.probWeightBase || 0;
            this.$aim[aim.name] = {
                name: aim.name,
                probWeight: new ValueModifier(this, {
                    pct: (thisVM) =>
                        Math.trunc(
                            (thisVM.effective /
                                (anatomyData.$sum[aim.name] ||
                                    thisVM.effective ||
                                    1)) *
                                100,
                        ),
                    ratio: (thisVM) =>
                        `${thisVM.effective}:${
                            anatomyData.$sum[aim.name] || thisVM.effective
                        }`,
                }),
            };
        });

        this.$bodyParts = IterWrap.create(this.actor.allItems()).reduce(
            (ary, it) => {
                if (it.system instanceof BodyPartItemData) {
                    if (it.nestedIn?.id === this.id) {
                        ary.push(it);
                    }
                }
                return ary;
            },
            [],
        );
    }
}

export class BodyPartItemData extends SohlItemData {
    $heldItem;
    $aim;
    $bodyLocations;
    $health;

    static get typeName() {
        return "bodypart";
    }

    static get typeLabel() {
        return {
            singular: "Body Part",
            plural: "Body Parts",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/ribcage.svg";
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            abbrev: new fields.StringField({
                initial: "",
                label: "Abbreviation",
            }),
            canHoldItem: new fields.BooleanField({
                initial: false,
                label: "Can Hold Item",
                hint: "Whether this body part can hold an item",
            }),
            heldItemId: new fields.StringField({
                initial: "",
                label: "Held Item Id",
            }),
            isSubordinate: new fields.BooleanField({
                initial: false,
                label: "Is Subordinate",
                hint: "Whether this body part serves a lesser or supporting role compared to other body parts in the same body zone",
            }),
            healthBase: new fields.NumberField({
                integer: true,
                initial: 0,
                min: 0,
                label: "health",
                hint: "How much this body part contributes to the overall health",
            }),
            aim: new fields.ArrayField(
                new fields.SchemaField(
                    {
                        name: new fields.StringField({
                            initial: "",
                            label: "Area Name",
                            name: "Area location name",
                        }),
                        probWeightBase: new fields.NumberField({
                            integer: true,
                            initial: 0,
                            min: 0,
                            label: "Area Probability Weight",
                            hint:
                                "The ratio of how often this body " +
                                "part is hit compared to all body parts " +
                                "in the same area for the body zone",
                        }),
                    },
                    {
                        label: "Aim",
                    },
                ),
            ),
        });
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$aim = {};
        this.$health = new ValueModifier(this);
        this.$health.setBase(this.healthBase);
    }

    /** @override */
    processSiblings() {
        super.processSiblings();

        // Body Part Items should never show up under the actor's "owned" items, they should always be
        // virtual items nested within a BodyZone item.  But let's just ensure that if this is not the
        // case we abandon processing immediately.
        if (this.actor && !this.item.isNested) {
            console.warn(
                `Item ${this.uuid} is a BodyPart that is not nested in a BodyZone, please correct this`,
            );
        }

        const bodyZoneData = this.item.cause.system;
        this.aim.forEach((aim) => {
            if (bodyZoneData?.$aim[aim.name]) {
                bodyZoneData.$aim[aim.name].sum =
                    bodyZoneData.$aim[aim.name].sum + aim.probWeightBase || 0;
            }
            this.$aim[aim.name] = {
                name: aim.name,
                probWeight: new ValueModifier(this, {
                    pct: (thisVM) =>
                        Math.trunc(
                            (thisVM.effective /
                                (bodyZoneData.$aim[aim.name].sum ||
                                    thisVM.effective ||
                                    1)) *
                                100,
                        ),
                    ratio: (thisVM) =>
                        `${thisVM.effective}:${
                            bodyZoneData.$sum[aim.name] || thisVM.effective
                        }`,
                }).setBase(aim.probWeightBase),
                sum: 0,
            };
        });

        this.$bodyLocations = IterWrap.create(this.actor.allItems()).reduce(
            (ary, it) => {
                if (it.system instanceof BodyLocationItemData) {
                    if (it.cause?.id === this.id) {
                        ary.push(it);
                    }
                }
                return ary;
            },
            [],
        );

        this.$heldItem =
            this.canHoldItem &&
            this.heldItemId &&
            this.actor.items.find((it) => it.id === this.heldItemId);
    }

    /** @override */
    postProcess() {
        super.postProcess();
        /*
         * Check all held items to ensure they still exist and are carried,
         * otherwise drop the item from the body part.
         */
        if (this.$heldItem?.system instanceof GearItemData) {
            if (this.$heldItem.system.isCarried) {
                this.$heldItem.system.$isHeldBy.push(this.item.id);
            } else {
                const heldItemType =
                    SohlItem.types[this.$heldItem.type].typeLabel.singular;
                ui.notifications.warn(
                    `${heldItemType} ${this.$heldItem.name} is not carried, so dropping it from ${this.item.name}`,
                );
                this.update({ "system.heldItem": "" });
            }
        }
    }
}

export class BodyLocationItemData extends SohlItemData {
    $protection;
    $layers;
    $aim;
    $traits;

    static get typeName() {
        return "bodylocation";
    }

    static get typeLabel() {
        return {
            singular: "Body Location",
            plural: "Body Locations",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/hand.svg";
    }

    static get effectKeys() {
        const aspects = Object.keys(ImpactModifier.aspectTypes).reduce(
            (obj, key) => {
                obj[`system.armorBase.${key}`] = [key, key];
                return obj;
            },
            {},
        );
        return Utility.simpleMerge(super.effectKeys, aspects);
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            abbrev: new fields.StringField({
                initial: "",
                label: "Abbreviation",
            }),
            layers: new fields.StringField({
                initial: "",
                label: "Layers",
                hint: "Materials that cover this location",
            }),
            armorBase: new fields.SchemaField(
                {
                    blunt: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Blunt",
                    }),
                    edged: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Edged",
                    }),
                    piercing: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Piercing",
                    }),
                    fire: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Fire",
                    }),
                },
                {
                    label: "Armor",
                },
            ),
            isFumble: new fields.BooleanField({
                initial: false,
                label: "Fumble",
                hint: "Can the location fumble",
            }),
            isStumble: new fields.BooleanField({
                initial: false,
                label: "Stumble",
                hint: "Can the location stumble",
            }),
            aim: new fields.ArrayField(
                new fields.SchemaField(
                    {
                        name: new fields.StringField({
                            initial: "",
                            label: "Area Name",
                            hint: "location name",
                        }),
                        probWeightBase: new fields.NumberField({
                            integer: true,
                            initial: 0,
                            min: 0,
                            label: "Area Prob Weight",
                            hint:
                                "The ratio of how often this body " +
                                "location is hit compared to all body locations " +
                                "in the same area for the body part",
                        }),
                    },
                    {
                        label: "Aim",
                    },
                ),
            ),
        });
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$aim = {};
        this.$protection = {
            blunt: new ValueModifier(this).setBase(this.armorBase.blunt),
            edged: new ValueModifier(this).setBase(this.armorBase.edged),
            piercing: new ValueModifier(this).setBase(this.armorBase.piercing),
            fire: new ValueModifier(this).setBase(this.armorBase.fire),
        };
        this.$layers = this.layers;
        this.$traits = {
            isRigid: false,
        };
    }

    /** @override */
    processSiblings() {
        super.processSiblings();

        // Body Location Items should never show up under the actor's "owned" items, they should always be
        // virtual items nested within a BodyPart item.  But let's just ensure that if this is not the
        // case we abandon processing immediately.
        if (this.actor && !this.item.isNested) {
            console.warn(
                `Item ${this.uuid} is a Body Location that is not nested in a Body Part, please correct this`,
            );
        }

        const bodyPartData = this.item.nestedIn.system;
        this.aim.forEach((aim) => {
            if (bodyPartData.$aim[aim.name]) {
                bodyPartData.$aim[aim.name].sum =
                    bodyPartData.$aim[aim.name].sum + aim.probWeightBase || 0;
            }
            this.$aim[aim.name] = {
                name: aim.name,
                probWeight: new ValueModifier(this, {
                    pct: (thisVM) =>
                        Math.trunc(
                            (thisVM.effective /
                                (bodyPartData.$aim[aim.name]?.sum || 1)) *
                                100,
                        ),
                }).setBase(aim.probWeightBase),
                sum: 0,
            };
        });
    }
}

export class MysticalDeviceItemData extends SubtypeMixin(SohlItemData) {
    static get typeName() {
        return "mysticaldevice";
    }

    static get typeLabel() {
        return {
            singular: "Mystical Device",
            plural: "Mystical Devices",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/magic-wand.svg";
    }

    /** @enum */
    static get subTypes() {
        return {
            artifact: "Arcane Artifact",
            talisman: "Shamanic Talisman",
            remnant: "Earthmaster Remnant",
            relic: "Divine Relic",
        };
    }

    static get talismanTypes() {
        return {
            ancestor: "Ancestor Spirit Power",
            totem: "Totem Spirit Power",
        };
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            isAttuned: new fields.BooleanField({
                initial: false,
                label: "Attuned",
            }),
            requiresAttunement: new fields.BooleanField({
                initial: false,
                label: "Requires Attunement",
            }),
            volition: new fields.SchemaField(
                {
                    ego: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Ego",
                    }),
                    morality: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Morality",
                    }),
                    purpose: new fields.StringField({
                        initial: "",
                        label: "Purpose",
                    }),
                },
                {
                    label: "Volition",
                },
            ),
        });
    }
}

export class GearItemData extends SohlItemData {
    _totalWeight;
    $weight;
    $value;
    $quality;
    $durability;
    $isHeldBy;
    $skillItem;
    $traits;

    static get effectKeys() {
        return Utility.simpleMerge(super.effectKeys, {
            "system.$value": { label: "Value", abbrev: "Val" },
            "system.$weight": { label: "Weight", abbrev: "Wt" },
            "system.$quality": { label: "Quality", abbrev: "Qal" },
            "system.$durability": { label: "Durability", abbrev: "Dur" },
        });
    }

    static get mods() {
        return foundry.utils.mergeObject(super.mods, {
            Durability: { name: "Durability", abbrev: "Dur" },
        });
    }

    get container() {
        return this.nestedIn instanceof ContainerGearItemData
            ? this.nestedIn
            : null;
    }

    get totalWeight() {
        return this._totalWeight;
    }

    get equipped() {
        return false;
    }

    static defineSchema() {
        return foundry.utils.mergeObject(
            super.defineSchema(),
            {
                abbrev: new fields.StringField({
                    initial: "",
                    label: "Abbreviation",
                }),
                quantity: new fields.NumberField({
                    integer: true,
                    initial: 1,
                    min: 0,
                    label: "Quantity",
                }),
                weightBase: new fields.NumberField({
                    initial: 0,
                    min: 0,
                    label: "Weight",
                }),
                valueBase: new fields.NumberField({
                    initial: 0,
                    min: 0,
                    label: "Value",
                }),
                isCarried: new fields.BooleanField({
                    initial: true,
                    label: "Carried",
                }),
                isEquipped: new fields.BooleanField({
                    initial: false,
                    label: "Equipped",
                }),
                qualityBase: new fields.NumberField({
                    integer: true,
                    initial: 0,
                    min: 0,
                    label: "Quality",
                }),
                durabilityBase: new fields.NumberField({
                    integer: true,
                    initial: 0,
                    min: 0,
                    label: "Durability",
                }),
            },
            { inplace: false },
        );
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$isHeldBy = [];
        this.$skillItem = null;
        this.$value = new ValueModifier(this);
        this.$value.setBase(this.valueBase);
        this.$weight = new ValueModifier(this);
        this.$weight.setBase(this.weightBase);
        this.$quality = new ValueModifier(this);
        this.$quality.setBase(this.qualityBase);
        this.$durability = new ValueModifier(this);
        this.$durability.setBase(this.durabilityBase);
        this._totalWeight = new ValueModifier(this);

        // If the gear is inside of a container, then the "carried"
        // flag is inherited from the container.
        if (this.nestedIn) {
            this.isCarried = this.nestedIn.system.isCarried;

            // Anything in a container is unequipped automatically
            this.isEquipped = false;
        }

        this.isEquipped &&= this.isCarried;
    }

    /** @override */
    prepareDerivedData() {
        super.prepareDerivedData();
        const baseWeight = this.isCarried
            ? Utility.maxPrecision(this.quantity * this.$weight.effective, 2)
            : 0;
        this._totalWeight.setBase(baseWeight);

        // Add quality to durability
        if (this.$quality.effective) {
            this.$durability.add(
                GearItemData.mods.Durability.name,
                GearItemData.mods.Durability.abbrev,
                this.$quality.effective,
            );
        }
    }
}

export class ConcoctionGearItemData extends SubtypeMixin(GearItemData) {
    static get typeName() {
        return "concoctiongear";
    }

    static get typeLabel() {
        return {
            singular: "Concoction",
            plural: "Concoctions",
        };
    }

    static get subTypes() {
        return {
            mundane: "Mundane",
            exotic: "Exotic",
            elixir: "Elixir",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/potion.svg";
    }

    static get potencyTypes() {
        return {
            na: "NA",
            mild: "Mild",
            strong: "Strong",
            great: "Great",
        };
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            potency: new fields.StringField({
                initial: "na",
                blank: false,
                label: "Potency",
                choices: this.potencyTypes,
            }),
            strength: new fields.NumberField({
                integer: true,
                initial: 0,
                min: 0,
                label: "Strength",
            }),
        });
    }
}

export class MiscGearItemData extends GearItemData {
    static get typeName() {
        return "miscgear";
    }

    static get typeLabel() {
        return {
            singular: "Misc Gear",
            plural: "Misc Gear",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/miscgear.svg";
    }
}

export class ContainerGearItemData extends GearItemData {
    $capacity;

    static get typeName() {
        return "containergear";
    }

    static get typeLabel() {
        return {
            singular: "Container",
            plural: "Containers",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/sack.svg";
    }

    static get status() {
        return {
            Ok: 0,
            OverEncumbered: 1,
            OverMax: 2,
        };
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            maxCapacityBase: new fields.NumberField({
                integer: true,
                initial: 0,
                min: 0,
                label: "Max Capacity",
            }),
        });
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$capacity = new ValueModifier(this, {
            max: new ValueModifier(this),
            value: (thisVM) => {
                return Math.round(thisVM.effective * 1000) / 1000;
            },
            status: (thisVM) => {
                if (thisVM.parent.totalWeight.modifier > thisVM.max.effective) {
                    return ContainerGearItemData.status.OverMax;
                } else {
                    return ContainerGearItemData.status.Ok;
                }
            },
        });
        this.$capacity.max.setBase(this.maxCapacityBase);
    }

    calcContentWeight() {
        this.items.forEach((it) => {
            if (it.system instanceof GearItemData) {
                if (it.system instanceof ContainerGearItemData) {
                    it.system.calcContentWeight();
                }

                this.totalWeight.add(
                    this.name,
                    `${this.abbrev}Wt`,
                    it.system.totalWeight.effective,
                );
            }
        });
    }

    /** @override */
    postProcess() {
        super.postProcess();
        this.calcContentWeight();
    }
}

export class ArmorGearItemData extends GearItemData {
    $protection;
    $traits;

    static get typeName() {
        return "armorgear";
    }

    static get typeLabel() {
        return {
            singular: "Armor",
            plural: "Armor",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/armor.svg";
    }

    static get rididArmor() {
        return {
            gambeson: "Gambeson",
            kurbul: "Kurbul",
            scale: "Scale",
            mail: "Mail",
            plate: "Plate",
            shell: "Shell",
            stone: "Stone",
            bone: "Bone",
            other: "Other Rigid",
        };
    }

    get equipped() {
        return this.isEquipped;
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            material: new fields.StringField({
                initial: "",
                label: "Material",
            }),
            locations: new fields.SchemaField(
                {
                    flexible: new fields.SetField(
                        new fields.StringField({
                            initial: "",
                        }),
                        {
                            label: "Flexible",
                        },
                    ),
                    rigid: new fields.SetField(
                        new fields.StringField({
                            initial: "",
                        }),
                        {
                            label: "Rigid",
                        },
                    ),
                },
                {
                    label: "Locations",
                },
            ),
            protectionBase: new fields.SchemaField(
                {
                    blunt: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Blunt",
                    }),
                    edged: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Edged",
                    }),
                    piercing: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Piercing",
                    }),
                    fire: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Fire",
                    }),
                },
                {
                    label: "Protection",
                },
            ),
        });
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$protection = {};
        Object.keys(this.protectionBase).forEach((p) => {
            this.$protection[p] = new ValueModifier(this);
            this.$protection[p].setBase(this.protectionBase[p]);
        });
    }

    /** @override */
    postProcess() {
        super.postProcess();
        if (this.isEquipped) {
            const blList = this.actor.itemTypes[
                BodyLocationItemData.typeName
            ].filter(
                (i) =>
                    this.locations.flexible.has(i.name) ||
                    this.locations.rigid.has(i.name),
            );
            blList.forEach((bl) => {
                const blData = bl.system;

                Object.keys(this.$protection).forEach((aspect) => {
                    if (this.$protection[aspect].effective)
                        blData.$protection[aspect].add(
                            this.item.name,
                            this.abbrev,
                            this.$protection[aspect].effective,
                        );
                });

                // if a material has been specified, add it to the layers
                if (this.material) {
                    if (blData.$layers) blData.$layers += ",";
                    blData.$layers += this.material;
                }

                // If any of the armor is rigid, then flag the whole bodylocation as rigid.
                blData.$traits.isRigid ||= this.locations.rigid.has(bl.name);
            });
        }
    }
}

export class WeaponGearItemData extends GearItemData {
    $heldBy;
    $heldByFavoredPart;

    static get typeName() {
        return "weapongear";
    }

    static get typeLabel() {
        return {
            singular: "Weapon",
            plural: "Weapons",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/sword.svg";
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$heldBy = [];
        this.$heldByFavoredPart = false;
    }

    /** @override */
    processSiblings() {
        super.processSiblings();
        let favParts = this.actor.getTraitByAbbrev("favparts");
        favParts &&= favParts.system.textValue.split(",").map((v) => v.trim());
        this.$heldByFavoredPart = false;
        this.$heldBy = this.actor.itemTypes[BodyPartItemData.typeName].reduce(
            (ary, it) => {
                if (it.system.heldItemId === this.item.id) {
                    ary.push(it);
                    this.$heldByFavoredPart ||= favParts.includes(it.name);
                }
                return ary;
            },
            [],
        );
    }
}

export class ProjectileGearItemData extends SubtypeMixin(GearItemData) {
    $traits;
    $attack;
    $impact;

    static get typeName() {
        return "projectilegear";
    }

    static get typeLabel() {
        return {
            singular: "Projectile",
            plural: "Projectiles",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/arrow.svg";
    }

    static get effectKeys() {
        return Utility.simpleMerge(super.effectKeys, {
            "system.traits.blunt": {
                label: "Blunt Impact",
                abbrev: "ProjBlunt",
            },
            "system.traits.bleed": { label: "Bleeding", abbrev: "ProjBld" },
            "system.traits.armorReduction": {
                label: "Armor Reduction",
                abbrev: "ProjAR",
            },
        });
    }

    /** @enum */
    static get subTypes() {
        return {
            none: "None",
            arrow: "Arrow",
            bolt: "Bolt",
            bullet: "Bullet",
            dart: "Dart",
            other: "Other",
        };
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            shortName: new fields.StringField({
                initial: "",
                label: "Short Name",
            }),
            impactBase: new fields.SchemaField(
                {
                    numDice: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "# of Dice",
                    }),
                    die: new fields.NumberField({
                        integer: true,
                        initial: 6,
                        min: 1,
                        label: "Die",
                    }),
                    modifier: new fields.NumberField({
                        integer: true,
                        initial: -1,
                        min: -1,
                        label: "Modifier",
                    }),
                    aspect: new fields.StringField({
                        initial: "blunt",
                        blank: false,
                        label: "Aspect",
                    }),
                },
                { label: "Impact" },
            ),
        });
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        this.$traits = {
            impactTA: 0,
            halfImpact: false,
            extraBleedRisk: false,
        };
        this.$attack = new CombatModifier(this);
        this.$impact = new ImpactModifier(this, {
            numDice: this.impactBase.numDice,
            die: this.impactBase.die,
            aspect: this.impactBase.aspect,
        });
        this.$impact.setBase(this.impactBase.modifier);
    }
}

export class EventItemData extends SohlItemData {
    $targetUuid;

    static get typeName() {
        return "event";
    }

    static get typeLabel() {
        return {
            singular: "Event",
            plural: "Events",
        };
    }

    static get defaultImage() {
        return "systems/hm/assets/icons/gear.svg";
    }

    static get operators() {
        return {
            duration: "Duration",
            indefinite: "Indefinite",
            now: "Now",
        };
    }

    static get actionScopes() {
        return {
            self: "Event",
            item: "Parent Item",
            actor: "Parent Actor",
            other: "Other",
        };
    }

    static get autoRestartStates() {
        return {
            never: "Never",
            once: "Once",
            always: "Always",
        };
    }

    static defineSchema() {
        return foundry.utils.mergeObject(super.defineSchema(), {
            tag: new fields.StringField({
                initial: "",
                label: "Purpose Tag",
                hint: "Identifies the purpose of this event",
            }),
            actionName: new fields.StringField({
                initial: "",
                label: "Action",
                hint: "Action to perform when time expires",
            }),
            activation: new fields.SchemaField(
                {
                    scope: new fields.StringField({
                        initial: "self",
                        blank: false,
                        choices: EventItemData.actionScopes,
                        label: "Action Scope",
                    }),
                    targetUuid: new fields.StringField({
                        initial: "",
                        label: "Target UUID",
                    }),
                    duration: new fields.NumberField({
                        integer: true,
                        initial: 0,
                        min: 0,
                        label: "Duration",
                    }),
                    initTime: new fields.NumberField({
                        integer: true,
                        initial: Number.MAX_SAFE_INTEGER,
                        min: 0,
                        label: "Initialize Time",
                    }),
                    oper: new fields.StringField({
                        initial: "gte",
                        blank: false,
                        choices: EventItemData.operators,
                        label: "Operator",
                    }),
                    autoRestart: new fields.StringField({
                        initial: "never",
                        blank: false,
                        choices: EventItemData.autoRestartStates,
                        label: "Auto Restart",
                    }),
                },
                {
                    label: "Activation",
                },
            ),
        });
    }

    get target() {
        let result;
        switch (this.activation.scope) {
            case "self":
                result = this.item;
                break;

            case "item":
                result = this.item.nestedIn;
                break;

            case "actor":
                result = this.item.actor;
                break;

            case "other":
                result = fromUuidSync(this.$targetUuid);
                break;
        }
        return result;
    }

    get initiated() {
        return this.activation.initTime >= game.time.worldTime;
    }

    get initTime() {
        return {
            worldDate: EventItemData.getWorldDateLabel(
                this.activation.initTime,
            ),
            time: this.activation.initTime,
        };
    }

    get activateTime() {
        let worldDate;
        let time;
        if (this.activation.oper === "indefinite") {
            worldDate = "Indefinite";
            time = Number.MAX_SAFE_INTEGER;
        } else if (this.activation.oper === "now") {
            worldDate = EventItemData.getWorldDateLabel(game.time.worldTime);
            time = game.time.worldTime;
        } else {
            const activateTime =
                this.activation.initTime + this.activation.duration;
            worldDate = EventItemData.getWorldDateLabel(activateTime);
            time = activateTime;
        }
        return { worldDate, time };
    }

    get totalDuration() {
        let label, value;
        if (this.activation.oper === "indefinite") {
            label = "Indefinite";
            value = Number.MAX_SAFE_INTEGER;
        } else if (this.activation.oper === "now") {
            label = "Now";
            value = 0;
        } else {
            label = Utility.formatDuration(this.activation.duration);
            value = this.activation.duration;
        }
        return { label, value };
    }

    get remainingDuration() {
        let label, value;
        if (!this.initiated) {
            label = "Not Initiated";
            value = 0;
        } else if (this.activation.oper === "indefinite") {
            label = "Indefinite";
            value = Number.MAX_SAFE_INTEGER;
        } else if (this.activation.oper === "now") {
            label = "Now";
            value = 0;
        } else {
            const duration = Math.max(
                0,
                this.activateTime.time - game.time.worldTime,
            );
            label = Utility.formatDuration(duration);
            value = duration;
        }
        return { label, value };
    }

    get elapsedDuration() {
        const duration = game.time.worldTime - this.activation.initTime;
        let label, value;
        if (!this.initiated) {
            label = "Not Initiated";
            value = 0;
        } else {
            value = Math.max(0, duration);
            label = Utility.formatDuration(duration);
        }
        return { label, value };
    }

    /**
     * Encode the time using the in-world calendar, "Indefinite"
     * if time is 0, or "No Calendar" if an in-world calendar is not defined
     *
     * @param {number} time in-world seconds since the start of the game
     * @returns {string} the current calendar time formatted
     *                   like "13 Nolus TR720 13:42:10", or "Indefinite" if time is 0
     */
    static getWorldDateLabel(time) {
        let worldDateLabel = "No Calendar";
        if (HM.hasSimpleCalendar) {
            const ct = SimpleCalendar.api.timestampToDate(time);
            worldDateLabel = `${ct.display.day} ${ct.display.monthName} ${ct.display.yearPrefix}${ct.display.year}${ct.display.yearPostfix} ${ct.display.time}`;
        }
        return worldDateLabel;
    }

    static _start(item, { time = game.time.worldTime } = {}) {
        const updateData = {
            "system.activation.initTime": time,
        };

        if (item.system.activation.autoRestart === "once") {
            updateData["system.activation.autoRestart"] = "never";
        }

        return updateData;
    }

    async start({ time = game.time.worldTime } = {}) {
        const updateData = EventItemData._start(this.item, { time });
        return await this.item.update(updateData);
    }

    async stop() {
        const updateData = {
            "system.activation.initTime": Number.MAX_SAFE_INTEGER,
        };
        return await this.item.update(updateData);
    }

    async checkAndExecute() {
        if (!this.initiated) return false;

        let isActivated = false;
        switch (EventItemData.operators[this.activation.oper]) {
            case "duration":
                isActivated = !this.remainingDuration.value;
                break;

            case "indefinite":
                isActivated = false;
                break;

            case "now":
                isActivated = true;
                break;

            default:
                throw new Error(`Invalid operator ${this.activation.oper}`);
        }

        if (isActivated) {
            const target = this.target;
            if (!target) {
                throw new Error(`Target not found`);
            }
            await target.system.execute(this.actionName);
            if (
                this.activation.autoRestart ===
                EventItemData.autoRestartStates.never
            ) {
                await this.item.delete();
            } else {
                const updateData = EventItemData._start(this.item);
                if (
                    this.activation.autoRestart ===
                    EventItemData.autoRestartStates.once
                ) {
                    updateData["system.activation.autoRestart"] = "never";
                }
                return await this.item.update(updateData);
            }
        }

        return isActivated;
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
        switch (this.activation.scope) {
            case "self":
                this.$targetUuid = this.item.uuid;
                break;

            case "item":
                this.$targetUuid = this.item.nestedIn?.uuid;
                break;

            case "actor":
                this.$targetUuid = this.item.actor?.uuid;
                break;

            case "other":
                this.$targetUuid = this.activation.targetUuid;
                break;
        }
    }
}

export class SkillBase {
    _attrs;
    _formula;
    _sunsigns;
    _parsedFormula;
    _value;

    constructor(formula, { items = null, sunsign = null } = {}) {
        if (!formula) {
            this._formula = null;
            this._attrs = {};
            this._sunsigns = [];
        }

        if (items && !(Symbol.iterator in Object(items))) {
            throw new Error("items must be iterable");
        }

        this._formula = formula || null;
        this._attrs = {};
        this._sunsigns = sunsign?.system.textValue.split("-") || [];
        this._parsedFormula = formula ? this._parseFormula : [];
        if (items) {
            const attributes = items.filter(
                (it) =>
                    it.type === "trait" &&
                    it.system.intensity === "attribute" &&
                    it.system.isNumeric,
            );
            this._parsedFormula.forEach((param) => {
                const type = typeof param;

                if (type === "string") {
                    const [subType, name, mult = 1] = param.split(":");
                    if (subType === "attr") {
                        const attr = attributes.find(
                            (obj) => obj.system.abbrev === name,
                        );

                        const score = Number.parseInt(
                            attr.system.textValue,
                            10,
                        );
                        if (Number.isInteger(score)) {
                            this._attrs[attr.system.abbrev] = {
                                name: attr.name,
                                value: score * mult,
                            };
                        } else {
                            throw new Error(
                                "invalid attribute value not number",
                            );
                        }
                    }
                }
            });
        }

        this._value = formula ? this._calcValue() : 0;
    }

    get valid() {
        return !!this.parsedFormula.length;
    }

    get formula() {
        return this._formula;
    }

    get parsedFormula() {
        return this._parsedFormula;
    }

    get sunsigns() {
        return this._sunsigns;
    }

    get attributes() {
        return Object.values(this._attrs).map((a) => a.name);
    }

    get value() {
        return this._value;
    }

    /**
     * Parses a skill base formula.
     *
     * A valid SB formula looks like this:
     *
     *   "@str, @int, @sta, hirin:2, ahnu, 5"
     *
     * meaning
     *   average STR, INT, and STA
     *   add 2 if sunsign hirin (modifier after colon ":")
     *   add 1 if sunsign ahnu (1 since no modifier specified)
     *   add 5 to result
     *
     * A valid formula must have exactly 2 or more attributes, everything else is optional.
     *
     * @returns {object[]} A parsed skill base formula
     */
    get _parseFormula() {
        const parseResult = [];
        let modifier = 0;

        let isFormulaValid = true;
        // All parts of the formula are separated by commas,
        // and we lowercase here since the string is processed
        // case-insensitive.
        const sbParts = this._formula.toLowerCase().split(",");

        for (let param of sbParts) {
            if (!isFormulaValid) break;

            param = param.trim();
            if (param != "") {
                if (param.startsWith("@")) {
                    // This is a reference to an attribute

                    // Must have more than just the "@" sign
                    if (param.length === 1) {
                        isFormulaValid = false;
                        break;
                    }

                    const paramName = param.slice(1);
                    parseResult.push(`attr:${paramName}`);
                    continue;
                }

                if (param.match(/^\W/)) {
                    // This is a sunsign

                    let ssParts = param.split(":");

                    // if more than 2 parts, it's invalid
                    if (ssParts.length > 2) {
                        isFormulaValid = false;
                        break;
                    }

                    const ssName = ssParts[0].trim;
                    let ssCount = 1;
                    // if second part provided, must be a number
                    if (ssParts.length === 2) {
                        const ssNumber = ssParts[1].trim().match(/^[-+]?\d+/);
                        if (ssNumber) {
                            ssCount = Number.parseInt(ssNumber[0], 10);
                        } else {
                            isFormulaValid = false;
                        }
                        break;
                    }

                    parseResult.push(`ss:${ssName}:${ssCount}`);

                    continue;
                }

                // The only valid possibility left is a number.
                // If it"s not a number, it's invalid.
                if (param.match(/^[-+]?\d+$/)) {
                    modifier += Number.parseInt(param, 10);
                    parseResult.push(modifier);
                } else {
                    isFormulaValid = false;
                    break;
                }
            }
        }

        return isFormulaValid ? parseResult : null;
    }

    /**
     * Calculates a skill base value.
     *
     * @returns A number representing the calculated skill base
     */
    _calcValue() {
        if (!this.valid) return 0;
        let attrScores = [];
        let ssBonus = Number.MIN_SAFE_INTEGER;
        let modifier = 0;
        this.parsedFormula.forEach((param) => {
            const type = typeof param;

            if (type === "number") {
                modifier += param;
            } else if (type === "string") {
                const [subType, name, mult = 1] = param.split(":");
                if (subType === "attr") {
                    attrScores.push(this._attrs[name]?.value || 0);
                } else if (subType === "ss") {
                    if (this.sunsigns.includes(name)) {
                        // We matched a character's sunsign, apply modifier
                        // Character only gets the largest sunsign bonus
                        ssBonus = Math.max(Number.parseInt(mult, 10), ssBonus);
                    }
                }
            }
        });

        ssBonus = ssBonus > Number.MIN_SAFE_INTEGER ? ssBonus : 0;
        let result = attrScores.reduce((acc, cur) => acc + cur, 0);
        result = result / attrScores.length;

        if (attrScores.length === 2) {
            // Special rounding rule: if only two attributes, and
            // primary attr > secondary attr, round up, otherwise round down
            result =
                attrScores[0] > attrScores[1]
                    ? Math.ceil(result)
                    : Math.floor(result);
        } else {
            // Otherwise use normal rounding rules
            result = Math.round(result);
        }

        result += ssBonus + modifier;

        result = Math.max(0, result); // Make sure result is >= 0

        return result;
    }
}

export class Utility {
    static *combine(...iterators) {
        for (let it of iterators) yield* it;
    }

    // A very simple object merge method that doesn't try to do
    // anything fancy.  Always modifies target.
    static simpleMerge(target, changes) {
        return Object.entries(changes).reduce((obj, [k, v]) => {
            obj[k] = v;
            return obj;
        }, target);
    }

    /*
    cyrb53 (c) 2018 bryc (github.com/bryc)
    License: Public domain (or MIT if needed). Attribution appreciated.
    A fast and simple 53-bit string hash function with decent collision resistance.
    Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
    https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
*/
    static cyrb53(str, seed = 0) {
        let h1 = 0xdeadbeef ^ seed,
            h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
        h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
        h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    }

    static async onAlterTime(
        time,
        { days = 0, hours = 0, mins = 0, secs = 0 } = {},
    ) {
        const currentWorldTime = game.time.worldTime;
        const gameStartTime = 0;
        const dialogData = {
            timeBases: {
                world: "Current World Time",
                existing: "From Existing Time",
                epoch: "From Game Start Time",
            },
            timeDirections: {
                future: "Toward the Future",
                past: "Toward the Past",
            },
            timeBase: "world",
            setTime: time,
            days,
            hours,
            mins,
            secs,
        };

        let dlgTemplate = "systems/hm/templates/dialog/time-dialog.html";
        const html = await renderTemplate(dlgTemplate, dialogData);

        const dlgResult = await Dialog.prompt({
            title: "Adjust Time",
            content: html.trim(),
            label: `Adjust Time`,
            render: (html) => {
                html.querySelector('[name="timeBase"]').addEventListener(
                    "change",
                    (e) => {
                        const time = html.querySelector("#time");
                        let newValue =
                            e.target.value === "existing"
                                ? Utility.htmlWorldTime(time)
                                : e.target.value === "world"
                                  ? Utility.htmlWorldTime(currentWorldTime)
                                  : Utility.htmlWorldTime(gameStartTime);
                        time.innerHTML = newValue;
                    },
                );
            },
            callback: (html) => {
                const form = html.querySelector("form");
                const fd = new FormDataExtended(form);
                const formData = foundry.utils.expandObject(fd.object);
                const timeBase = formData.timeBase;
                const direction = formData.direction;
                const days = Number.parseInt(formData.days, 10);
                const hours = Number.parseInt(formData.hours, 10);
                const mins = Number.parseInt(formData.mins, 10);
                const secs = Number.parseInt(formData.secs, 10);
                let newTime =
                    timeBase === "world"
                        ? game.time.worldTime
                        : timeBase === "existing"
                          ? dialogData.setTime
                          : 0;
                const diff = days * 86400 + hours * 3600 + mins * 60 + secs;
                newTime += direction === "future" ? diff : -diff;
                return newTime;
            },
            rejectClose: false,
            options: { jQuery: false },
        });

        return dlgResult;
    }

    /**
     * Coerces value to the specified maximum precision.  If the value has greater than
     * the specified precision, then rounds the value to the specified precision.  If
     * the value has less than or equal to the specified precision, the value is unchanged.
     *
     * @param {number} value Source value to be evaluated
     * @param {number} [precision=0] Maximum number of characters after decimal point
     * @returns {number} value rounded to the specified precision
     */
    static maxPrecision(value, precision = 0) {
        return +parseFloat(value).toFixed(precision);
    }

    /**
     * Returns number of victory stars.
     * @param {*} atkSuccLvl
     * @param {*} defSuccLvl
     * @returns Positive numbers for attacker victory stars, and negative numbers for defender victory stars.
     * Zero indicates a tie. If there are no victory stars at all (due to both having failures), returns null.
     */
    static calcVictoryStars(atkSuccLvl, defSuccLvl = null) {
        if (defSuccLvl === null) {
            return atkSuccLvl >= HM.CONST.SUCCESS_LEVEL.MarginalSuccess
                ? atkSuccLvl
                : null;
        } else {
            if (
                atkSuccLvl <= HM.CONST.SUCCESS_LEVEL.MarginalFailure &&
                defSuccLvl <= HM.CONST.SUCCESS_LEVEL.MarginalFailure
            ) {
                return null;
            } else {
                return atkSuccLvl - defSuccLvl;
            }
        }
    }

    static victoryStarsText(vs) {
        const result = {
            vsList: ["None"],
            text: "Both Fail",
            isTester: false,
            isOpponent: false,
            isTied: false,
        };
        if (vs !== null) {
            result.victoryStars = Math.abs(vs);
            if (vs) {
                result.isTester = vs > 0;
                result.isOpponent = !result.isTester;
                result.vsList = new Array(result.victoryStars).fill(
                    result.isTester
                        ? HM.CONST.CHARS.STARF
                        : HM.CONST.CHARS.STAR,
                );
                result.text = result.vsList.join("");
            } else {
                result.isTied = true;
            }
        }
        return result;
    }

    static async moveQtyDialog(item, dest) {
        // Render modal dialog
        let dlgData = {
            itemName: item.name,
            targetName: dest.name || this.actor.name,
            maxItems: item.system.quantity,
        };

        if (item.nestedIn) {
            dlgData.sourceName = `${item.nestedIn.label}`;
        } else {
            dlgData.sourceName = this.actor.name;
        }

        const compiled = Handlebars.compile(`<form id="items-to-move">
            <p>Moving ${dlgData.itemName} from ${dlgData.sourceName} to ${dlgData.targetName}</p>
            <div class="form-group">
                <label>How many (0-${dlgData.maxItems})?</label>
                {{numberInput ${dlgData.maxItems} name="itemstomove" step=1 min=0 max=${dlgData.maxItems}}}
            </div>
            </form>`);
        const dlghtml = compiled(dlgData, {
            allowProtoMethodsByDefault: true,
            allowProtoPropertiesByDefault: true,
        });

        // Create the dialog window
        const result = await Dialog.prompt({
            title: "Move Items",
            content: dlghtml,
            label: "OK",
            callback: async (html) => {
                const form = html.querySelector("form");
                const fd = new FormDataExtended(form);
                const formdata = foundry.utils.expandObject(fd.object);
                let formQtyToMove = Number.parseInt(formdata.itemstomove) || 0;

                return formQtyToMove;
            },
            options: { jQuery: false },
            rejectClose: false,
        });

        return result || 0;
    }

    static createAction(event, parent) {
        if (event.preventDefault) event.preventDefault();
        const dataset = event.currentTarget.dataset;
        const isChat = dataset.type === "chat";

        let dlghtml = `<form>
            <div class="form-group">
                <label>Action Name:</label>
                <input name="name" type="text" placeholder="Action Name"/>
            </div>
            <div class="form-group">
                <label>Macro Type:</label>
                <select name="type">
                    <option value="script" ${!isChat ? "selected" : ""}>Script</option>
                    <option value="chat" ${isChat ? "selected" : ""}>Chat</option>
                </select>
            </div>
        </form>`;

        // Create the dialog window
        return Dialog.prompt({
            title: "Create Action",
            content: dlghtml,
            label: "Create",
            callback: async (html) => {
                const form = html.querySelector("form");
                const fd = new FormDataExtended(form);
                const formData = foundry.utils.expandObject(fd.object);

                const hasAction = parent.system.actions.some(
                    (it) =>
                        !it.getFlag("hm", "isIntrinsicAction") &&
                        it.name === formData.name,
                );
                if (hasAction) {
                    ui.notifications.error(
                        `An action named ${formData.name} already exists on ${parent.label}`,
                    );
                    return null;
                }

                const action = await SohlMacro.create(
                    { name: formData.name, type: formData.type },
                    { nestedIn: parent },
                );
                action.sheet.render(true);
                return action;
            },
            options: { jQuery: false },
            rejectClose: false,
        });
    }

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    static deleteAction(event, action) {
        if (!action) {
            console.error(`SoHL | Delete aborted, action not specified.`);
            return null;
        }

        return Dialog.confirm({
            title: `Delete Action: ${action.name}`,
            content:
                "<p>Are You Sure?</p><p>This action will be deleted and cannot be recovered.</p>",
            yes: () => {
                return action.delete();
            },
        });
    }

    /**
     * Generates a unique name by appending numerical suffixes to the specified prefix if necessary. Iterates over the provided items to ensure the generated name does not already exist in the list.
     *
     * @static
     * @param {*} prefix
     * @param {*} items
     * @returns {*}
     */
    static uniqueName(prefix, items) {
        let candidate = prefix;
        if (items instanceof Map || items instanceof Array) {
            let ord = 0;
            while (items.some((n) => n.name === candidate)) {
                ord++;
                candidate = `${prefix} ${ord}`;
            }
        }

        return candidate;
    }

    static htmlWorldTime(value) {
        const worldDateLabel = EventItemData.getWorldDateLabel(value);
        const remainingDurationLabel = Utility.formatDuration(
            value - game.time.worldTime,
        );
        const html = `<span data-tooltip="${worldDateLabel}">${remainingDurationLabel}</span>`;
        return html;
    }

    static formatDuration(age) {
        const duration = Math.abs(age);
        const days = Math.floor(duration / 86400);
        const hours = Math.floor((duration % 86400) / 3600);
        const min = Math.floor((duration % 3600) / 60);
        const sec = duration % 60;
        let result = days ? `${days}d ` : "";
        result += hours ? `${hours}h ` : "";
        result += min ? `${min}m ` : "";
        result += !result || sec ? `${sec}s` : "";
        result += age > 0 ? " in the future" : age < 0 ? " ago" : "";
        return result;
    }

    /**
     * A static method that converts a given number of seconds to a normalized time format. It calculates the normalized hours, minutes, and seconds based on the input seconds value and constructs a formatted time string. Returns an object with 'label' property containing the formatted time string and 'inFuture' property indicating whether the input seconds value is negative.
     *
     * @static
     * @param {*} seconds
     * @returns {{ label: string; inFuture: boolean; }}
     */
    static toNormTime(seconds) {
        const asecs = Math.abs(seconds);
        const normHours = Math.floor(asecs / 3600);
        const remSeconds = asecs % 3600;
        const normMinutes = Number(Math.floor(remSeconds / 60))
            .toString()
            .padStart(2, "0");
        const normSeconds = Number(remSeconds % 60)
            .toString()
            .padStart(2, "0");
        return {
            label: `${normHours}:${normMinutes}:${normSeconds}`,
            inFuture: seconds < 0,
        };
    }

    /**
     * Convert an integer into a roman numeral.  Taken from:
     * http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
     *
     * @param {Integer} num
     */
    static romanize(num) {
        if (isNaN(num)) return NaN;
        var digits = String(+num).split(""),
            key = [
                "",
                "C",
                "CC",
                "CCC",
                "CD",
                "D",
                "DC",
                "DCC",
                "DCCC",
                "CM",
                "",
                "X",
                "XX",
                "XXX",
                "XL",
                "L",
                "LX",
                "LXX",
                "LXXX",
                "XC",
                "",
                "I",
                "II",
                "III",
                "IV",
                "V",
                "VI",
                "VII",
                "VIII",
                "IX",
            ],
            roman = "",
            i = 3;
        while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    }

    /**
     * @typedef {Object} RollResult
     * @property {number} origTarget
     * @property {number} target
     * @property {boolean} isCapped
     * @property {number} rollTotal
     * @property {Roll} rollObj
     * @property {boolean} isCritical
     * @property {boolean} isSuccess
     * @property {number} lastDigit
     * @property {number} successLevel
     * @property {string} description
     */

    /**
     * Perform a generic dice roll
     *
     * @param {string} rollFormula Dice formula (e.g., "1d3+4")
     * @param {number} target Target value to test against
     * @param {number} successLevelMod Success Level Modifier
     * @param {data} context replacement data for roll formula
     * @returns {RollResult} Object containing results of the roll
     */
    static async rollTest(
        rollFormula,
        {
            target = 0,
            critFailure = [],
            critSuccess = [],
            successLevelMod = 0,
            minResult = Number.MIN_VALUE,
            maxResult = Number.MAX_VALUE,
            context = {},
        } = {},
    ) {
        const rollObj = new Roll(rollFormula, context);
        const roll = await rollObj.evaluate();
        if (!roll) {
            throw new Error(
                `SoHL | Roll evaluation failed, diceSpec=${rollFormula}`,
            );
        }

        const lastDigit = roll.total % 10;
        const cappedTarget = Math.max(Math.min(target, maxResult), minResult);
        let rollResults = {
            origTarget: target,
            target: cappedTarget,
            isCapped: target !== cappedTarget,
            rollTotal: roll.total,
            rollObj: roll,
            isCritical: false,
            isSuccess: false,
            lastDigit: lastDigit,
            successLevel: 0,
            description: "",
        };

        rollResults.successLevel =
            roll.total <= rollResults.target
                ? HM.CONST.SUCCESS_LEVEL.MarginalSuccess
                : HM.CONST.SUCCESS_LEVEL.MarginalFailure;
        rollResults.successLevel += successLevelMod;
        rollResults.isSuccess =
            rollResults.successLevel >= HM.CONST.SUCCESS_LEVEL.MarginalSuccess;

        if (critSuccess.length || critFailure.length) {
            rollResults.isCritical = rollResults.isSuccess
                ? critSuccess.includes(lastDigit)
                : critFailure.includes(lastDigit);
            if (rollResults.isCritical) {
                rollResults.description = rollResults.isSuccess
                    ? "Critical Success"
                    : "Critical Failure";
            } else {
                rollResults.description = rollResults.isSuccess
                    ? "Marginal Success"
                    : "Marginal Failure";
            }

            // If success level is greater than critical success or less than critical failure
            // then add the amount to the end of the description
            let successLevelIncr = 0;
            if (rollResults.isCritical) {
                successLevelIncr =
                    rollResults.successLevel -
                    (rollResults.isSuccess
                        ? HM.CONST.SUCCESS_LEVEL.CriticalSuccess
                        : HM.CONST.SUCCESS_LEVEL.CriticalFailure);
            }
            if (successLevelIncr > 1 || successLevelIncr < -1) {
                rollResults.description = `${rollResults.description} (${
                    (successLevelIncr > 0 ? "+" : "") + successLevelIncr
                })`;
            }
        } else {
            rollResults.successLevel = Math.max(
                Math.min(
                    rollResults.successLevel,
                    HM.CONST.SUCCESS_LEVEL.MarginalSuccess,
                ),
                HM.CONST.SUCCESS_LEVEL.MarginalFailure,
            );
            rollResults.description = rollResults.isSuccess
                ? "Success"
                : "Failure";
        }

        return rollResults;
    }

    /**
     * Calculates the distance from sourceToken to targetToken in "scene" units (e.g., feet).
     *
     * @param {Token} sourceToken
     * @param {Token} targetToken
     * @param {Boolean} gridUnits If true, return in grid units, not "scene" units
     */
    static rangeToTarget(sourceToken, targetToken, gridUnits = false) {
        if (!sourceToken) {
            throw new Error(`sourceToken not provided`);
        }
        if (!targetToken) {
            throw new Error(`target not provided`);
        }
        if (!canvas.scene?.grid) {
            ui.notifications.warn(`No scene active`);
            return null;
        }
        if (!gridUnits && !["feet", "ft"].includes(canvas.scene.grid.units)) {
            ui.notifications.warn(
                `Scene uses units of ${canvas.scene.grid.units} but only feet are supported, distance calculation not possible`,
            );
            return null;
        }

        // If the current scene is marked "Theatre of the Mind", then range is always 0
        if (canvas.scene.getFlag("hm", "isTotm")) return 0;

        const source = sourceToken.center;
        const dest = targetToken.center;

        const segments = [];
        const ray = new Ray(source, dest);
        segments.push({ ray });
        const distances = canvas.grid.measureDistances(segments, {
            gridSpaces: true,
        });

        if (gridUnits)
            return Math.round(distances[0] / canvas.dimensions.distance);
        return distances[0];
    }

    /**
     * Returns the single selected token if there is exactly one token selected
     * on the canvas, otherwise issue a warning.
     *
     * @static
     * @param {object} [options]
     * @param {boolean} [options.quiet=false] suppress warning messages
     * @returns {Token|null} The currently selected token, or null if there is not exactly one selected token
     */
    static getSingleSelectedToken({ quiet = false } = {}) {
        const numTargets = canvas.tokens?.controlled?.length;
        if (!numTargets) {
            if (!quiet)
                ui.notifications.warn(`No selected tokens on the canvas.`);
            return null;
        }

        if (numTargets > 1) {
            if (!quiet)
                ui.notifications.warn(
                    `There are ${numTargets} selected tokens on the canvas, please select only one`,
                );
            return null;
        }

        return canvas.tokens.controlled[0].document;
    }

    static async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    static async getDocsFromPacks(
        packNames,
        { documentName = "Item", docType },
    ) {
        let allDocs = [];
        for (let packName of packNames) {
            const pack = game.packs.get(packName);
            if (!pack) continue;
            if (pack.documentName !== documentName) continue;
            const query = {};
            if (docType) {
                query["type"] = docType;
            }
            const items = await pack.getDocuments(query);
            allDocs.push(...items);
        }
        return allDocs;
    }

    /**
     * A static asynchronous function that retrieves an item from the specified
     * packs based on the item name, pack names, and optionally item type.
     * It iterates over each pack name, gets the pack object from the game data,
     * constructs a query object based on the item name and optional item type,
     * and fetches documents that match the query from the pack. If any results
     * are found, the first result is assigned to the variable 'result' and the
     * iteration stops. Finally, it returns the found item or null if no item is found.
     *
     * @static
     * @async
     * @param {string} docName
     * @param {string[]} packNames
     * @param {object} options
     * @param {string} [options.itemType]
     * @param {boolean} [options.keepId]
     * @returns {object} data representing a document from the compendium
     */
    static async getDocumentFromPacks(
        docName,
        packNames,
        { documentName = "Item", docType, keepId } = {},
    ) {
        let data = null;
        const allDocs = await Utility.getDocsFromPacks(packNames, {
            documentName,
            docType,
        });
        const doc = allDocs?.find((it) => it.name === docName);
        if (doc) {
            // Cleanup item data
            data = doc.toObject();
            if (!keepId) data._id = foundry.utils.randomID();
            delete data.folder;
            delete data.sort;
            if (doc.pack)
                foundry.utils.setProperty(
                    data,
                    "_stats.compendiumSource",
                    doc.uuid,
                );
            if ("ownership" in data) {
                data.ownership = {
                    default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
                    [game.user.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
                };
            }
            if (doc.effects) {
                data.effects = doc.effects.contents.map((e) => e.toObject());
            }
        }

        return data;
    }

    /**
     * Creates a 16-digit sequence of hexadecimal digits, suitable for use as
     * an ID, but such that the same input string will produce the same output
     * every time.
     *
     * @param {string} str Input string to convert to hash
     * @returns Sequence of 16 hexadecimal digits as a string
     */
    static createHash16(str) {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const ary = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < str.length; i++) {
            ary[i % 16] += str.codePointAt(i);
        }
        let id = "";
        for (let i = 0; i < 16; i++) id += chars[ary[i] % chars.length];
        return id;
    }

    /**
     * Loads a JSON file and returns an object representing the JSON structure.
     *
     * @param {string} filepath path to the JSON file
     * @returns {object} The parsed JSON structure
     */
    static async loadJSONFromFile(filepath) {
        const json = await foundry.utils.fetchJsonWithTimeout(
            foundry.utils.getRoute(filepath, { prefix: ROUTE_PREFIX }),
        );
        return json;
    }
}

/**
 * Firefox and many other browsers do not implement the latest Iterator helper
 * methods, so they are implemented in this class for compatibility.
 *
 * The reason to use this instead of Array.from() is that this class and its methods
 * do not need to create an intermediate array, but handle the iterable directly.
 */
export class IterWrap {
    _iter;

    constructor(iter) {
        if (!(typeof iter[Symbol.iterator] === "function")) {
            throw new Error(
                "Parameter to IterWrap constructor must be iterable",
            );
        }

        this._iter = iter;
    }

    static create(iter) {
        if (["null", "undefined"].includes(typeof iter)) return null;
        return new IterWrap(iter);
    }

    find(callbackFn) {
        let idx = 0;
        let { value, done } = this._iter.next();
        while (!done) {
            const result = callbackFn(value, idx++);
            if (result) return value;
            ({ value, done } = this._iter.next());
        }
        return null;
    }

    filter(callbackFn) {
        let idx = 0;
        const ary = [];
        let { value, done } = this._iter.next();
        while (!done) {
            const result = callbackFn(value, idx++);
            if (result) ary.push(value);
            ({ value, done } = this._iter.next());
        }
        return ary;
    }

    map(callbackFn) {
        let idx = 0;
        const ary = [];
        let { value, done } = this._iter.next();
        while (!done) {
            const result = callbackFn(value, idx++);
            ary.push(result);
            ({ value, done } = this._iter.next());
        }
        return ary;
    }

    forEach(callbackFn) {
        let idx = 0;
        let { value, done } = this._iter.next();
        while (!done) {
            callbackFn(value, idx++);
            ({ value, done } = this._iter.next());
        }
        return undefined;
    }

    reduce(callbackFn, initialValue = null) {
        let idx = 0;
        let { value, done } = this._iter.next();
        let accumulator = initialValue;
        if (!accumulator) {
            if (!done) {
                initialValue = value;
                ({ value, done } = this._iter.next());
            } else {
                throw new Error("No initializer");
            }
        }

        while (!done) {
            callbackFn(accumulator, value, idx++);
            ({ value, done } = this._iter.next());
        }
        return accumulator;
    }

    some(callbackFn) {
        return !!this.find(callbackFn);
    }

    toArray() {
        return Array.from(this._iter);
    }

    [Symbol.iterator]() {
        return this._iter;
    }
}
export class SohlContextMenu extends ContextMenu {
    static get sortGroups() {
        return {
            Default: "aaa",
            Primary: "aab",
            General: "zaa",
            Deprecated: "zzz",
        };
    }

    _setPosition(html, target, { event } = {}) {
        //const container = target[0].parentElement;
        let container = target.parents("div.app");

        // Append to target and get the context bounds
        target.css("position", "relative");
        html.css("visibility", "hidden");
        html.css("width", "fit-content");
        container.append(html);

        const contextRect = html[0].getBoundingClientRect();
        const containerRect = container[0].getBoundingClientRect();
        const mouseX = event.pageX - containerRect.left;
        const mouseY = event.pageY - containerRect.top;

        const contextTopOffset = mouseY;
        let contextLeftOffset = Math.min(
            containerRect.width - contextRect.width,
            mouseX,
        );

        // Determine whether to expand upwards
        const contextTopMax = mouseY - contextRect.height;
        const contextBottomMax = mouseY + contextRect.height;
        const canOverflowUp =
            contextTopMax > containerRect.top ||
            getComputedStyle(container[0]).overflowY === "visible";

        // If it overflows the container bottom, but not the container top
        this._expandUp =
            contextBottomMax > containerRect.height &&
            (contextTopMax >= 0 || canOverflowUp);

        const contextTop = this._expandUp
            ? contextTopOffset - contextRect.height
            : contextTopOffset;
        const contextBottom = contextTop + contextRect.height;

        // Display the menu
        html.toggleClass("expand-up", this._expandUp);
        html.toggleClass("expand-down", !this._expandUp);

        html.css("top", `${contextTop}px`);
        html.css("bottom", `${contextBottom}px`);
        if (contextLeftOffset) html.css("left", `${contextLeftOffset}px`);
        html.css("visibility", "");
        target.addClass("context");
    }
}

export class SohlActiveEffectData extends foundry.abstract.TypeDataModel {
    static get typeName() {
        return "hmactiveeffect";
    }

    static get typeLabel() {
        return {
            singular: "Injury",
            plural: "Injuries",
        };
    }

    static get defaultImage() {
        return "icons/svg/aura.svg";
    }

    get targetLabel() {
        const targetType = this.targetType || "actor";
        const targetName = this.targetName || "";
        const attrs = this.targetAttr?.split(",");
        const actor =
            this.parent.parent instanceof SohlActor
                ? this.parent.parent
                : this.parent.parent.actor;

        let result;
        if (targetType === "actor") {
            result = `This Actor: ${
                actor.isToken ? actor.token.name : actor.name
            }`;
        } else if (targetType === "this") {
            if (this.parent.parent instanceof SohlItem) {
                result = `This ${this.parent.parent.system.constructor.typeLabel.singular}`;
            } else if (actor) {
                result = `This Actor: ${
                    actor.isToken ? actor.token.name : actor.name
                }`;
            }
        } else if (attrs?.length) {
            result = `SB Formula Has: ${attrs.join(" or ")}`;
        } else if (this.targetNameRE === ".+") {
            result = `All ${SohlItem.types[targetType].typeLabel.plural}`;
        } else {
            result = `${SohlItem.types[targetType].typeLabel.singular}: ${targetName}`;
        }
        return result;
    }

    get targetNameRE() {
        let name = this.targetName;
        // CASE 1: name is empty or starts with "attr:" means all names are valid
        if (!name || name.startsWith("attr:")) return ".+";
        // CASE 2: name starts with "regex:" means remainder is already a regular expression
        if (name.startsWith("regex:")) return name.slice(6).trim();
        // CASE 3: name is assumed to be in extended "glob" format, convert to RegEx
        return this._globrex(name, { extended: true }).regex.source;
    }

    get targetAttr() {
        if (!this.targetName) return null;

        const name = this.targetName;
        if (name.startsWith("attr:")) {
            return name.slice(5).trim();
        }
        return null;
    }

    /* Return the single target of this one active effect */
    get target() {
        // This really doesn't make sense, since AE in HM can have multiple targets,
        // but this method is used in a number of places so we make it kinda work
        const targets = this.targets;
        return targets.length ? this.targets[0] : null;
    }

    /* Return all of the documents (Items and Actors) targeted by this Active Effect */
    get targets() {
        let targets = [];
        const targetAttr = this.targetAttr;
        const targetType = this.targetType;
        if (targetType === "uuid") {
            const target = fromUuidSync(this.targetName, {
                strict: false,
            });
            if (!target) {
                console.warn(
                    `Effect target with UUID ${this.targetName} not found`,
                );
            } else {
                targets.push(target);
            }
        } else if (this.parent.parent instanceof SohlItem) {
            const item = this.parent.parent;
            const itemActor = item.actor;
            if (targetType === "actor") return itemActor ? [itemActor] : [];
            if (targetType === "this") return [item];

            // If there is no parent actor, then we are done
            if (!itemActor) return [];

            // If the targetAttr is defined, find all of the sibling items with that attribute in their SB Formula
            if (
                targetAttr &&
                HM.sysVer.CONFIG.Item.dataModels[targetType] instanceof
                    MasteryLevelItemData
            ) {
                const targetAttrNames = this.targetAttr.split(",");
                targetAttrNames.forEach((attrName) => {
                    targets = itemActor.itemTypes[targetType].filter((it) =>
                        it.system.skillBase.attributes.includes(attrName),
                    );
                });
            } else {
                // Find all of the sibling items matching the target name
                const re = new RegExp(this.targetNameRE);
                targets = itemActor.itemTypes[targetType].filter((it) =>
                    re.test(it.name),
                );
            }
        } else if (this.parent.parent instanceof SohlActor) {
            const actor = this.parent.parent;
            if (["actor", "this"].includes(targetType)) return [actor];

            // Find all actor's item targets
            if (
                targetAttr &&
                [
                    SkillItemData.typeName,
                    MysticalAbilityItemData.typeName,
                ].includes(targetType)
            ) {
                const targetAttrNames = this.targetAttr.split(",");
                targetAttrNames.forEach((attrName) => {
                    targets = actor.itemTypes[targetType].filter((it) =>
                        it.system.skillBase.attributes.includes(attrName),
                    );
                });
            } else {
                const re = new RegExp(this.targetNameRE);
                targets = actor.itemTypes[targetType].filter((it) =>
                    re.test(it.name),
                );
            }
        }

        return targets;
    }

    /** @override */
    static defineSchema() {
        return {
            targetName: new fields.StringField({
                initial: "this",
                label: "Target Name",
            }),
            targetType: new fields.StringField({
                initial: "",
                label: "Target Type",
                choices: SohlActiveEffect.targetTypes,
            }),
        };
    }

    /**
     * Convert any glob pattern to a JavaScript Regexp object.
     *
     * Taken from https://github.com/terkelg/globrex
     *
     * @author Terkel Gjervig Nielsen
     * @license MIT
     *
     * @param {String} glob Glob pattern to convert
     * @param {Object} opts Configuration object
     * @param {Boolean} [opts.extended=false] Support advanced ext globbing
     * @param {Boolean} [opts.globstar=false] Support globstar
     * @param {Boolean} [opts.strict=true] be laissez faire about mutiple slashes
     * @param {Boolean} [opts.filepath=""] Parse as filepath for extra path related features
     * @param {String} [opts.flags=""] RegExp globs
     * @returns {Object} converted object with string, segments and RegExp object
     */
    static _globrex(
        glob,
        {
            extended = false,
            globstar = false,
            strict = false,
            filepath = false,
            flags = "",
        } = {},
    ) {
        const isWin = navigator.platform.indexOf("Win") > -1;
        const SEP = isWin ? `\\\\+` : `\\/`;
        const SEP_ESC = isWin ? `\\\\` : `/`;
        const GLOBSTAR = `((?:[^/]*(?:/|$))*)`;
        const WILDCARD = `([^/]*)`;
        const GLOBSTAR_SEGMENT = `((?:[^${SEP_ESC}]*(?:${SEP_ESC}|$))*)`;
        const WILDCARD_SEGMENT = `([^${SEP_ESC}]*)`;

        let regex = "";
        let segment = "";
        let path = { regex: "", segments: [] };

        // If we are doing extended matching, this boolean is true when we are inside
        // a group (eg {*.html,*.js}), and false otherwise.
        let inGroup = false;
        let inRange = false;

        // extglob stack. Keep track of scope
        const ext = [];

        // Helper static to build string and segments
        function add(str, { split, last, only } = {}) {
            if (only !== "path") regex += str;
            if (filepath && only !== "regex") {
                path.regex += str === "\\/" ? SEP : str;
                if (split) {
                    if (last) segment += str;
                    if (segment !== "") {
                        if (!flags.includes("g")) segment = `^${segment}$`; // change it "includes"
                        path.segments.push(new RegExp(segment, flags));
                    }
                    segment = "";
                } else {
                    segment += str;
                }
            }
        }

        let c, n;
        for (let i = 0; i < glob.length; i++) {
            c = glob[i];
            n = glob[i + 1];

            if (["\\", "$", "^", ".", "="].includes(c)) {
                add(`\\${c}`);
                continue;
            }

            if (c === "/") {
                add(`\\${c}`, { split: true });
                if (n === "/" && !strict) regex += "?";
                continue;
            }

            if (c === "(") {
                if (ext.length) {
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }

            if (c === ")") {
                if (ext.length) {
                    add(c);
                    let type = ext.pop();
                    if (type === "@") {
                        add("{1}");
                    } else if (type === "!") {
                        add("([^/]*)");
                    } else {
                        add(type);
                    }
                    continue;
                }
                add(`\\${c}`);
                continue;
            }

            if (c === "|") {
                if (ext.length) {
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }

            if (c === "+") {
                if (n === "(" && extended) {
                    ext.push(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }

            if (c === "@" && extended) {
                if (n === "(") {
                    ext.push(c);
                    continue;
                }
            }

            if (c === "!") {
                if (extended) {
                    if (inRange) {
                        add("^");
                        continue;
                    }
                    if (n === "(") {
                        ext.push(c);
                        add("(?!");
                        i++;
                        continue;
                    }
                    add(`\\${c}`);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }

            if (c === "?") {
                if (extended) {
                    if (n === "(") {
                        ext.push(c);
                    } else {
                        add(".");
                    }
                    continue;
                }
                add(`\\${c}`);
                continue;
            }

            if (c === "[") {
                if (inRange && n === ":") {
                    i++; // skip [
                    let value = "";
                    while (glob[++i] !== ":") value += glob[i];
                    if (value === "alnum") add("(\\w|\\d)");
                    else if (value === "space") add("\\s");
                    else if (value === "digit") add("\\d");
                    i++; // skip last ]
                    continue;
                }
                if (extended) {
                    inRange = true;
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }

            if (c === "]") {
                if (extended) {
                    inRange = false;
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }

            if (c === "{") {
                if (extended) {
                    inGroup = true;
                    add("(");
                    continue;
                }
                add(`\\${c}`);
                continue;
            }

            if (c === "}") {
                if (extended) {
                    inGroup = false;
                    add(")");
                    continue;
                }
                add(`\\${c}`);
                continue;
            }

            if (c === ",") {
                if (inGroup) {
                    add("|");
                    continue;
                }
                add(`\\${c}`);
                continue;
            }

            if (c === "*") {
                if (n === "(" && extended) {
                    ext.push(c);
                    continue;
                }
                // Move over all consecutive "*""s.
                // Also store the previous and next characters
                let prevChar = glob[i - 1];
                let starCount = 1;
                while (glob[i + 1] === "*") {
                    starCount++;
                    i++;
                }
                let nextChar = glob[i + 1];
                if (!globstar) {
                    // globstar is disabled, so treat any number of "*" as one
                    add(".*");
                } else {
                    // globstar is enabled, so determine if this is a globstar segment
                    let isGlobstar =
                        starCount > 1 && // multiple "*""s
                        (prevChar === "/" || prevChar === undefined) && // from the start of the segment
                        (nextChar === "/" || nextChar === undefined); // to the end of the segment
                    if (isGlobstar) {
                        // it"s a globstar, so match zero or more path segments
                        add(GLOBSTAR, { only: "regex" });
                        add(GLOBSTAR_SEGMENT, {
                            only: "path",
                            last: true,
                            split: true,
                        });
                        i++; // move over the "/"
                    } else {
                        // it"s not a globstar, so only match one path segment
                        add(WILDCARD, { only: "regex" });
                        add(WILDCARD_SEGMENT, { only: "path" });
                    }
                }
                continue;
            }

            add(c);
        }

        // When regexp "g" flag is specified don"t
        // constrain the regular expression with ^ & $
        if (!flags.includes("g")) {
            regex = `^${regex}$`;
            segment = `^${segment}$`;
            if (filepath) path.regex = `^${path.regex}$`;
        }

        const result = { regex: new RegExp(regex, flags) };

        // Push the last segment
        if (filepath) {
            path.segments.push(new RegExp(segment, flags));
            path.regex = new RegExp(path.regex, flags);
            path.globstar = new RegExp(
                !flags.includes("g")
                    ? `^${GLOBSTAR_SEGMENT}$`
                    : GLOBSTAR_SEGMENT,
                flags,
            );
            result.path = path;
        }

        return result;
    }
}

export class SohlActiveEffect extends ActiveEffect {
    get targetTypes() {
        return {
            uuid: "Document UUID",
            actor: "Actor",
            this: "Parent",
        };
    }

    get targetName() {
        return this.system.target?.name || "Unknown";
    }

    get modifiesActor() {
        if (!this.active) return false;
        return this.parent instanceof SohlItem
            ? this.system.targetType === "actor"
            : ["actor", "this"].includes(this.system.targetType);
    }

    /** @override */
    get isSuppressed() {
        // let hasAuralShock = false;
        // if (this.parent instanceof SohlActor) {
        //     if (!this.origin) return false;
        //     hasAuralShock = this.parent
        //         .allItems()
        //         .some(
        //             (it) =>
        //                 it.system instanceof AfflictionItemData &&
        //                 it.system.subType === "auralshock",
        //         );
        // } else {
        if (!this.origin) return true;
        // }

        if (this.parent instanceof SohlItem) {
            const source = this.parent;
            // If the item is a unequipped gear, then its effects are suppressed
            if (
                source.system instanceof GearItemData &&
                !source.system.isEquipped
            )
                return true;
        } else {
            const source = fromUuidSync(this.origin);
            if (!source) {
                console.warn(
                    `Actor ${this.parent.name} effect ${this.name} has invalid origin ${this.origin}`,
                );
                return true;
            }
        }

        // if (
        //     hasAuralShock &&
        //     source.system.skillBase.attributes.includes("Aura")
        // ) {
        //     return true;
        // }

        return false;
    }

    _getContextOptions() {
        const result = [
            {
                name: "Edit",
                icon: `<i class="fas fa-edit"></i>`,
                condition: (header) => {
                    if (game.user.isGM) return true;
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".effect");
                    const parent = fromUuidSync(li.dataset.effectParentUuid);
                    const effect = parent?.effects.get(li.dataset.effectId);
                    return effect?.isOwner;
                },
                callback: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".effect");
                    const parent = fromUuidSync(li.dataset.effectParentUuid);
                    const effect = parent?.effects.get(li.dataset.effectId);
                    if (effect) {
                        effect.sheet.render(true);
                    } else {
                        throw new Error(
                            `Effect ${li.dataset.effectUuid} not found.`,
                        );
                    }
                },
                group: SohlContextMenu.sortGroups.General,
            },
            {
                name: "Delete",
                icon: `<i class="fas fa-trash"></i>`,
                condition: (header) => {
                    if (game.user.isGM) return true;
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".effect");
                    const parent = fromUuidSync(li.dataset.effectParentUuid);
                    const effect = parent?.effects.get(li.dataset.effectId);
                    return effect?.isOwner;
                },
                callback: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".effect");
                    const parent = fromUuidSync(li.dataset.effectParentUuid);
                    const effect = parent?.effects.get(li.dataset.effectId);
                    if (effect) {
                        return Dialog.confirm({
                            title: `Delete Active Effect: ${effect.name}`,
                            content:
                                "<p>Are You Sure?</p><p>This active effect will be deleted and cannot be recovered.</p>",
                            yes: () => {
                                return effect.delete();
                            },
                        });
                    } else {
                        throw new Error(
                            `Effect ${li.dataset.effectUuid} not found.`,
                        );
                    }
                },
                group: SohlContextMenu.sortGroups.General,
            },
            {
                name: "Toggle",
                icon: `<i class="fas ${this.disabled ? "fa-toggle-on" : "fa-toggle-off"}"></i>`,
                condition: (header) => {
                    if (game.user.isGM) return true;
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".effect");
                    const parent = fromUuidSync(li.dataset.effectParentUuid);
                    const effect = parent?.effects.get(li.dataset.effectId);
                    return effect?.isOwner;
                },
                callback: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".effect");
                    const parent = fromUuidSync(li.dataset.effectParentUuid);
                    const effect = parent?.effects.get(li.dataset.effectId);
                    if (effect) {
                        effect.toggleEnabledState();
                    } else {
                        throw new Error(
                            `Effect ${li.dataset.effectUuid} not found.`,
                        );
                    }
                },
                group: SohlContextMenu.sortGroups.General,
            },
        ];
        return result;
    }

    async toggleEnabledState() {
        const updateData = {};
        if (this.disabled) {
            // Enable the Active Effect
            updateData["disabled"] = false;

            // Also set the timer to start now
            updateData["duration.startTime"] = game.time.worldTime;
            if (game.combat) {
                updateData["duration.startRound"] = game.combat.round;
                updateData["duration.startTurn"] = game.combat.turn;
            }
        } else {
            // Disable the Active Effect
            updateData["disabled"] = true;
        }
        return await this.update(updateData);
    }

    /** @override */
    _onCreate(data, options, userId) {
        super._onCreate(data, options, userId);

        // Reset the origin for this AE if it is on an item associated with an Actor
        if (
            this.parent instanceof SohlItem &&
            this.parent.parent instanceof SohlActor
        ) {
            this.origin = this.parent.uuid;
        }
    }

    /** @override */
    apply(doc, change) {
        let changes = {};
        if (change.key.startsWith("mod:")) {
            // Any change that starts with "mod:" is a modifier
            this._handleAEMods(doc, change, changes);
        } else {
            // Otherwise, handle as normal
            changes = super.apply(doc, change);
        }
        return changes;
    }

    _handleAEMods(doc, change, changes) {
        const parts = change.key.split(":");
        const modId = parts[1];
        const modKey = parts[2];

        const mods = foundry.utils.getProperty(doc, modKey);
        if (!(mods instanceof ValueModifier)) {
            console.error(
                `SoHL | Invalid target: "${modKey}" is not a ValueModifier for ${doc.name}`,
            );
            return;
        }

        const modName =
            modId === "AE"
                ? `AE: ${this.sourceName}`
                : doc.system.constructor.mods[modId].name;
        const modAbbr =
            modId === "AE" ? "AE" : doc.system.constructor.mods[modId].abbrev;

        switch (change.mode) {
            case CONST.ACTIVE_EFFECT_MODES.ADD:
                mods.add(modName, modAbbr, change.value);
                break;

            case CONST.ACTIVE_EFFECT_MODES.MULTIPLY:
                mods.multiply(modName, modAbbr, change.value);
                break;

            case CONST.ACTIVE_EFFECT_MODES.UPGRADE:
                mods.floor(modName, modAbbr, change.value);
                break;

            case CONST.ACTIVE_EFFECT_MODES.DOWNGRADE:
                mods.ceiling(modName, modAbbr, change.value);
                break;

            case CONST.ACTIVE_EFFECT_MODES.OVERRIDE:
                mods.set(modName, modAbbr, change.value);
                break;
        }

        return (changes[modKey] = mods);
    }

    async checkExpiredAndDisable() {
        if (!this.disabled) {
            const duration = this.duration;
            if (duration.type && duration.type !== "none") {
                if (duration.remaining <= 0) {
                    await this.update({ disabled: true });
                }
            }
        }
    }

    getEffectKeyValue(type, key) {
        if (type === "this") {
            type = this.parent.system.constructor.typeName;
        }
        const eKey = HM.sysVer.CONFIG.Item.dataModels?.[type].effectKeys?.[key];
        return eKey || { label: "Unknown", abbrev: "UNKNOWN" };
    }

    getEffectKeyChoices(type) {
        return HM.sysVer.CONFIG.Item.dataModels?.[type].effectKeys || [];
    }

    /**
     * Returns a string representation of the changes made. If there are no changes, it returns 'No Changes'. Each change is mapped to a formatted string based on the change mode. The format includes the key, value, and mode of the change. The prefix for each change is determined based on the targetType and the parent object. The format varies depending on the mode of the change, such as ADD, MULTIPLY, OVERRIDE, UPGRADE, DOWNGRADE, or default. The formatted strings for each change are joined with a comma separator and returned as a single string.
     *
     * @returns {*}
     */
    get _aeChanges() {
        if (!this.changes || !this.changes.length) {
            return "No Changes";
        }

        return this.changes
            .map((ch) => {
                const modes = CONST.ACTIVE_EFFECT_MODES;
                const key = ch.key;
                const val = ch.value;
                let prefix = this.getEffectKeyValue(
                    this.system.targetType,
                    key,
                ).abbrev;
                if (this.system.targetType === "this") {
                    if (this.parent instanceof SohlItem) {
                        prefix = this.getEffectKeyValue(
                            this.parent.type,
                            key,
                        ).abbrev;
                    } else if (this.parent instanceof SohlActor) {
                        prefix = this.getEffectKeyValue("actor", key).abbrev;
                    }
                }

                switch (ch.mode) {
                    case modes.ADD:
                        return `${prefix} ${val < 0 ? "-" : "+"} ${Math.abs(
                            val,
                        )}`;
                    case modes.MULTIPLY:
                        return `${prefix} ${HM.CONST.CHARS.TIMES} ${val}`;
                    case modes.OVERRIDE:
                        return `${prefix} = ${val}`;
                    case modes.UPGRADE:
                        return `${prefix} ${HM.CONST.CHARS.GREATERTHANOREQUAL} ${val}`;
                    case modes.DOWNGRADE:
                        return `${prefix} ${HM.CONST.CHARS.LESSTHANOREQUAL} ${val}`;
                    default:
                        return !val ? `${prefix}` : `${prefix} ~ ${val}`;
                }
            })
            .join(", ");
    }

    _prepareDuration() {
        const d = super._prepareDuration();
        if (d.type === "seconds") {
            d.endTime = d._worldTime + d.remaining;
            d.endTimeHtml = Utility.htmlWorldTime(d.endTime);
        }
        return d;
    }

    get _aeDuration() {
        const d = this.duration;

        // Time-based duration
        if (Number.isNumeric(d.seconds)) {
            const start = d.startTime || game.time.worldTime;
            const elapsed = game.time.worldTime - start;
            const remaining = Math.max(d.seconds - elapsed, 0);
            //const normDuration = toNormTime(d.seconds);
            const normRemaining = Utility.formatDuration(remaining);
            return {
                type: "seconds",
                duration: d.seconds,
                remaining: remaining,
                label: normRemaining,
            };
        }

        // Turn-based duration
        else if (d.rounds || d.turns) {
            // Determine the current combat duration
            const cbt = game.combat;
            const c = {
                round: cbt?.round ?? 0,
                turn: cbt?.turn ?? 0,
                nTurns: cbt?.turns.length ?? 1,
            };

            // Determine how many rounds and turns have elapsed
            let elapsedRounds = Math.max(c.round - (d.startRound || 0), 0);
            let elapsedTurns = c.turn - (d.startTurn || 0);
            if (elapsedTurns < 0) {
                elapsedRounds -= 1;
                elapsedTurns += c.nTurns;
            }

            // Compute the number of rounds and turns that are remaining
            let remainingRounds = (d.rounds || 0) - elapsedRounds;
            let remainingTurns = (d.turns || 0) - elapsedTurns;
            if (remainingTurns < 0) {
                remainingRounds -= 1;
                remainingTurns += c.nTurns;
            } else if (remainingTurns > c.nTurns) {
                remainingRounds += Math.floor(remainingTurns / c.nTurns);
                remainingTurns %= c.nTurns;
            }

            // Total remaining duration
            if (remainingRounds < 0) {
                remainingRounds = 0;
                remainingTurns = 0;
            }
            const duration = (c.rounds || 0) + (c.turns || 0) / 100;
            const remaining = remainingRounds + remainingTurns / 100;

            // Remaining label
            const label = [
                remainingRounds > 0 ? `${remainingRounds} Rounds` : null,
                remainingTurns > 0 ? `${remainingTurns} Turns` : null,
                remainingRounds + remainingTurns === 0 ? "None" : null,
            ].filterJoin(", ");
            return {
                type: "turns",
                duration: duration,
                remaining: remaining,
                label: label,
            };
        }

        // No duration
        else {
            return {
                type: "none",
                duration: null,
                remaining: null,
                label: "None",
            };
        }
    }
    static async create(data, options = {}) {
        let newData = foundry.utils.deepClone(data);

        if (Object.keys(newData).some((k) => /\./.test(k))) {
            newData = foundry.utils.expandObject(newData);
        }

        if (options.clean) {
            delete newData.sort;
        }

        if (!newData.img) {
            newData.img = CONFIG.controlIcons.effects;
        }

        // If nestedIn is specified, use update() on the nestedIn
        if (options.parent?.nestedIn) {
            const newAry = options.parent.nestedIn.effects.contents;

            const effectExists = newAry.some((obj) => obj._id === newData._id);
            if (effectExists) {
                throw new Error(
                    `Effect with id ${newData._id} already exists in ${options.parent.nestedIn.label}`,
                );
            }

            let effect = new SohlActiveEffect(newData, options);
            //await item._preCreate(newData, options, game.user);
            const effectData = effect.toObject();

            // Set sort property
            let maxSort = newAry.reduce(
                (max, obj) => Math.max(max, obj.sort),
                0,
            );
            maxSort += CONST.SORT_INTEGER_DENSITY;
            effectData.sort = maxSort;
            newAry.push(effectData);

            const result = await options.parent.nestedIn.update(
                { "system.effects": newAry },
                { nestedIn: options.parent.nestedIn },
            );
            options.parent.sheet.render();
            return result;
        } else {
            return await super.create(newData, options);
        }
    }

    /** @override */
    update(data = [], context = {}) {
        // Note that this method will return a direct response if called
        // on an item with an nestedIn, otherwise it will return a Promise.

        let result = null;

        if (this.parent?.nestedIn) {
            this.updateSource(data);
            const newAry = this.parent.effects.contents;
            const idx = newAry.findIndex((obj) => obj._id === this.id);
            if (idx >= 0) {
                newAry[idx] = this.toObject();
                newAry.sort((a, b) => a.sort - b.sort);
                const updateData = {
                    "system.effects": newAry,
                };
                result = this.parent.nestedIn.update(updateData, context);
                this.parent.sheet.render();
            }
        } else {
            result = super.update(data, context);
        }

        return result;
    }

    /** @override */
    delete(context = {}) {
        // Note that this method will return a direct response if called
        // on an item with either nestedIn or cause with a truthy value,
        // otherwise it will return a Promise.
        if (this.parent?.nestedIn) {
            const newAry = this.parent.effects.contents;
            const filtered = newAry.filter((obj) => obj._id !== this.id);
            if (filtered.length !== newAry.length) {
                this.parent.nestedIn.update(
                    { "system.effects": filtered },
                    context,
                );
            }
            this.parent.sheet.render();
            return this;
        } else {
            return super.delete(context);
        }
    }
}

/**
 * A form designed for creating and editing an Active Effect on an Actor or Item.
 * @implements {FormApplication}
 *
 * @param {ActiveEffect} object     The target active effect being configured
 * @param {object} [options]        Additional options which modify this application instance
 */
export class SohlActiveEffectConfig extends ActiveEffectConfig {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template: "systems/hm/templates/effect/active-effect-config.html",
        });
    }

    /* ----------------------------------------- */

    /** @override */
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    async getData(options) {
        const context = await super.getData();
        let targetType = context.data.system.targetType || "this";
        if (targetType === "this") {
            if (this.object.parent instanceof Item) {
                targetType = this.object.parent.type;
            } else if (this.object.parent instanceof Actor) {
                targetType = "actor";
            }
        }
        context.keyChoices = this.object.getEffectKeyChoices(targetType);
        context.sourceName = await this.object.sourceName;
        context.targetTypes = {
            this:
                this.object.parent instanceof Actor
                    ? "This Actor"
                    : `This ${
                          HM.sysVer.CONFIG.Item.typeLabels[
                              this.object.parent.type
                          ]
                      }`,
            uuid: "Item UUID",
        };
        if (this.object.parent instanceof Item) {
            context.targetTypes.actor = "Actor";
        }

        for (const key of Object.keys(HM.sysVer.CONFIG.Item.dataModels)) {
            switch (key) {
                case "actor":
                    context.targetTypes[key] = "Actor";
                    break;

                default:
                    context.targetTypes[key] =
                        HM.sysVer.CONFIG.Item.typeLabels[key];
                    break;
            }
        }

        if (HM.hasSimpleCalendar) {
            const ct = SimpleCalendar.api.timestampToDate(
                context.data.duration.startTime,
            );
            context.startTimeText = `${ct.display.day} ${ct.display.monthName} ${ct.display.yearPrefix}${ct.display.year}${ct.display.yearPostfix} ${ct.display.time}`;
        } else {
            const startTimeDiff =
                game.time.worldTime - context.data.duration.startTime;
            context.startTimeText = Utility.formatDuration(startTimeDiff);
        }

        return context;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        html.find(".alter-time").click((ev) => {
            const property = ev.currentTarget.dataset.property;
            let time = Number.parseInt(ev.currentTarget.dataset.time, 10);
            if (Number.isNaN(time)) time = 0;
            Utility.onAlterTime(time).then((result) => {
                if (result !== null) {
                    const updateData = { [property]: result };
                    this.object.update(updateData);
                }
            });
        });
    }
}

export class SohlMacro extends Macro {
    /** @override */
    _configure(options) {
        if (this.parent && !(this.parent instanceof SohlActor)) {
            throw new Error("Parent must always be an instance of SohlActor");
        }

        super._configure(options);

        Object.defineProperty(this, "nestedIn", {
            value: (() => {
                if ([null, undefined].includes(options.nestedIn)) return null;
                if (
                    options.nestedIn instanceof SohlItem ||
                    options.nestedIn instanceof SohlActor
                )
                    return options.nestedIn;
                throw new Error(
                    "The provided nestedIn must be an SohlItem or SohlActor instance",
                );
            })(),
            writable: false,
            enumerable: false,
        });
    }

    get isNested() {
        return !!this.nestedIn;
    }

    get item() {
        if (this.nestedIn instanceof SohlItem) {
            return this.nestedIn;
        }
        return null;
    }

    get actor() {
        if (this.nestedIn instanceof SohlActor) {
            return this.parent;
        } else if (this.nestedIn instanceof SohlItem) {
            return this.nestedIn.actor;
        } else {
            return null;
        }
    }

    get notes() {
        return this.getFlag("hm", "notes") || "";
    }

    set notes(value) {
        this.setFlag("hm", "notes", value ?? "");
    }

    get description() {
        return this.getFlag("hm", "description") || "";
    }

    set description(value) {
        this.setFlag("hm", "description", value ?? "");
    }

    get useAsync() {
        return this.getFlag("hm", "useAsync");
    }

    set useAsync(val) {
        this.setFlag("hm", "useAsync", !!val);
    }

    get nameParts() {
        const index = this.functionName.indexOf("$");
        if (index < 0) return { prefix: "", functionName: this.functionName };
        const prefix = this.functionName.slice(0, index);
        const fnName = this.functionName.slice(index + 1);
        return { prefix, functionName: fnName };
    }

    get params() {
        return this.getFlag("hm", "params") || {};
    }

    get functionName() {
        return this.getFlag("hm", "functionName") ?? "";
    }

    set functionName(value) {
        this.setFlag("hm", "functionName", value);
    }

    get isIntrinsicAction() {
        return !!this.getFlag("hm", "isIntrinsicAction");
    }

    set isIntrinsicAction(value) {
        this.setFlag("hm", "isIntrinsicAction", !!value);
    }

    get contextIconClass() {
        return this.getFlag("hm", "contextIconClass") ?? "";
    }

    set contextIconClass(value) {
        this.setFlag("hm", "contextIconClass", value);
    }

    get contextCondition() {
        return this.getFlag("hm", "contextCondition") ?? false;
    }

    set contextCondition(value) {
        this.setFlag("hm", "contextCondition", value);
    }

    get contextGroup() {
        return this.getFlag("hm", "contextGroup") ?? "";
    }

    set contextGroup(value) {
        this.setFlag("hm", "contextGroup", value);
    }

    setParam(name, value) {
        if (!name || Number.isNumeric(name)) {
            throw new Error(
                `Invalid parameter name "${name}", must be a non-numeric string`,
            );
        }

        const newParams = foundry.utils.deepClone(this.params);
        newParams[name] = value;
        this.setFlag("hm", "params", newParams);
    }

    deleteParam(name) {
        const newParams = foundry.utils.deepClone(this.params);
        delete newParams[name];
        this.setFlag("hm", "params", newParams);
    }

    get paramsLabel() {
        return Object.entries(this.params).reduce((str, [key, val]) => {
            if (str) str += ",";
            str += key;
            if (typeof val !== "undefined") {
                str += `=${val}`;
            }
            return str;
        }, "");
    }

    /** @override */
    get uuid() {
        if (!this._uuid) {
            if (this.nestedIn) {
                // If this is a nested object, we come up with a new UUID format
                // where the nested macro is defined with a hash mark
                let parts = [this.nestedIn.uuid, "NestedMacro", this.id];
                this._uuid = parts.join("#");
            } else {
                this._uuid = super.uuid;
            }
        }

        return this._uuid;
    }

    _getContextOptions() {
        const opts = [
            {
                name: "Execute",
                icon: `<i class="fas fa-gears"></i>`,
                condition: this.canExecute,
                callback: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const parent = fromUuidSync(li.dataset.parentUuid);
                    const action = parent.system.actions.get(li.dataset.itemId);
                    action.execute();
                },
                group: SohlContextMenu.sortGroups.Default,
            },
            {
                name: "Edit",
                icon: `<i class="fas fa-edit"></i>`,
                condition: !this.isIntrinsicAction,
                callback: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const parent = fromUuidSync(li.dataset.parentUuid);
                    const action = parent.system.actions.get(li.dataset.itemId);
                    action.sheet.render(true);
                },
                group: SohlContextMenu.sortGroups.General,
            },
            {
                name: "Delete",
                icon: `<i class="fas fa-trash"></i>`,
                condition: !this.isIntrinsicAction && this.isOwner,
                callback: (header) => {
                    header = header instanceof HTMLElement ? header : header[0];
                    const li = header.closest(".item");
                    const parent = fromUuidSync(li.dataset.parentUuid);
                    const action = parent.system.actions.get(li.dataset.itemId);
                    return Dialog.confirm({
                        title: `Delete Action: ${action.name}`,
                        content:
                            "<p>Are You Sure?</p><p>This action will be deleted and cannot be recovered.</p>",
                        yes: () => {
                            action.delete();
                        },
                    });
                },
                group: SohlContextMenu.sortGroups.General,
            },
        ];

        return opts;
    }

    /** @override */
    async _preCreate(data, options, user) {
        const allowed = await super._preCreate(data, options, user);
        if (allowed === false) return false;

        const updateData = foundry.utils.mergeObject(
            {
                type: CONST.MACRO_TYPES.SCRIPT,
                flags: {
                    hm: {
                        notes: "",
                        description: "",
                        params: {},
                        functionName: "",
                        contextIconClass: "",
                        contextCondition: false,
                        contextGroup: "",
                        isIntrinsicAction: false,
                        useAsync: true,
                    },
                },
            },
            data,
            { insertKeys: false, insertValues: false },
        );
        this.updateSource(updateData);
        return true;
    }

    static getExecuteDefaults({
        speaker = null,
        actor = null,
        token = null,
        character = null,
        needsActor = false,
        needsToken = false,
        self = null,
    }) {
        if (speaker && actor && token && character)
            return { speaker, actor, token, character };
        actor = actor || token?.actor;
        if (!actor) {
            actor = self.actor;
            token = actor?.getToken();
        }

        // Add variables to the evaluation scope.
        speaker ||= ChatMessage.getSpeaker({ actor, token });
        character ||= game.user.character;
        token ||= canvas.ready ? canvas.tokens.get(speaker.token) : null;
        actor ||= token?.actor || game.actors.get(speaker.actor);

        if (needsToken && !token) {
            throw new Error(`No Token defined`);
        } else if (needsActor && !actor) {
            throw new Error(`No Actor defined`);
        } else {
            return { speaker, actor, token, character };
        }
    }

    /** @override */
    execute({ self, actor, token, inPrepareData, ...scope } = {}) {
        self ||= this.parent?.system || this.nestedIn?.system || this;
        const argValues = Object.values(scope);
        let speaker, character, fn;
        if (this.type === CONST.MACRO_TYPES.CHAT) {
            ({ actor, token } = SohlMacro.getExecuteDefaults({
                actor,
                token,
                self,
            }));
            scope.token = token;
            scope.actor = actor;
            return super.execute(scope);
        } else if (this.type === CONST.MACRO_TYPES.SCRIPT) {
            if (this.isIntrinsicAction) {
                const { functionName } = this.nameParts;
                fn = self[functionName];
                if (!(fn instanceof Function)) fn = null;
            } else {
                // Unpack argument names and values
                const argNames = Object.keys(scope);
                if (argNames.some((k) => Number.isNumeric(k))) {
                    throw new Error(
                        "Illegal numeric Macro parameter passed to execution scope.",
                    );
                }

                const args = [
                    "speaker",
                    "actor",
                    "token",
                    "character",
                    "scope",
                    ...argNames,
                    `{${this.command}\n}`,
                ];

                if (this.useAsync) {
                    fn = new foundry.utils.AsyncFunction(...args);
                } else {
                    fn = new Function(...args);
                }
            }
        }
        if (fn) {
            // Attempt macro execution
            try {
                if (!inPrepareData) {
                    ({ speaker, actor, token, character } =
                        SohlMacro.getExecuteDefaults({
                            actor,
                            token,
                            self,
                        }));
                }

                return fn.call(
                    self,
                    speaker,
                    actor,
                    token,
                    character,
                    scope,
                    ...argValues,
                );
            } catch (err) {
                Hooks.onError("SohlMacro#execute", err, {
                    msg: `Error executing action ${this.name} on ${
                        self.constructor.typeLabel?.singular || "SohlMacro"
                    } ${self.name}`,
                    log: "error",
                });
            }
        }

        return null;
    }

    /**
     * Creates a new instance based on the provided data and context. If the context has a parent, a new instance of SohlMacro is created using the data and context. If the data does not have an _id property or if context.keepId is not true, a unique _id is generated using foundry.utils.randomID(). The macro is then checked for existence in the parent system's macros array. If the macro already exists, an error is thrown. If the macro is new, it is added to the macros array and parent is updated. Returns the created macro instance if successful, otherwise delegates creation to the superclass.
     *
     * @static
     * @async
     * @param {*} data
     * @param {{}} [context={}]
     * @returns {unknown}
     */
    static async create(data, context = {}) {
        if (context.nestedIn) {
            if (!(data._id && context.keepId)) {
                data._id = foundry.utils.randomID();
            }
            const macro = new SohlMacro(data, context);
            if (!macro) throw new Error(`Macro creation failed`);

            const macroData = macro.toObject();

            const newAry = foundry.utils.deepClone(
                macro.nestedIn.system.macros,
            );

            // Set sort property
            let maxSort = newAry.reduce(
                (max, obj) => Math.max(max, obj.sort),
                0,
            );
            maxSort += CONST.SORT_INTEGER_DENSITY;
            macroData.sort = maxSort;

            const macroExists = newAry.some((obj) => obj._id === macro.id);
            if (macroExists) {
                if (!context.keepId) {
                    throw new Error(
                        `Macro with id ${macro.id} already exists in ${macro.nestedIn.label}`,
                    );
                }
            } else {
                newAry.push(macroData);
                await macro.nestedIn.update(
                    { "system.macros": newAry },
                    context,
                );
            }
            return macro;
        } else {
            return await super.create(data, context);
        }
    }

    async update(data = [], context = {}) {
        if (this.nestedIn) {
            this.updateSource(data, context);
            this.sheet.render();

            let result = null;
            const idx = this.nestedIn.system.macros.findIndex(
                (obj) => obj._id === this.id,
            );
            if (idx >= 0) {
                const newAry = foundry.utils.deepClone(
                    this.nestedIn.system.macros,
                );
                newAry[idx] = this.toObject();
                newAry.sort((a, b) => a.sort - b.sort);
                result = await this.nestedIn.update(
                    { "system.macros": newAry },
                    context,
                );
            } else {
                console.error(
                    `Update called on SohlMacro that doesn't exist in ${this.nestedIn.name}, id=${this.id}`,
                );
            }
            return result;
        } else {
            return super.update(data, context);
        }
    }

    async delete(context = {}) {
        if (this.nestedIn) {
            const filtered = this.nestedIn.system.macros.filter(
                (obj) => obj._id !== this.id,
            );
            await this.nestedIn.update({ "system.macros": filtered }, context);
            this.sheet.close();
            return this;
        } else {
            return super.delete(context);
        }
    }
}

export class SohlMacroConfig extends MacroConfig {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["hm", "sheet", "macro", "macro-sheet"],
            template: "systems/hm/templates/dialog/macro-config.html",
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "script",
                },
            ],
            width: 560,
            height: 600,
            resizable: true,
        });
    }

    /** @override */
    getData(options = {}) {
        const data = super.getData(options);
        data.macroTypes = game.documentTypes.Macro.reduce((obj, t) => {
            if (
                t === CONST.MACRO_TYPES.SCRIPT &&
                !game.user.can("MACRO_SCRIPT")
            )
                return obj;
            obj[t] = game.i18n.localize(CONFIG.Macro.typeLabels[t]);
            return obj;
        }, {});
        data.editable = this.isEditable;
        data.const = HM.sysVer.CONST;
        data.config = HM.sysVer.CONFIG;
        return data;
    }

    get isEditable() {
        return !this.isIntrinsicAction && super.isEditable;
    }

    /** @inheritdoc */
    _onDragStart(event) {
        const li = event.currentTarget;
        if ("link" in event.target.dataset) return;

        // Create drag data
        let dragData;

        // Owned Items
        if (li.dataset.uuid) {
            const item = fromUuidSync(li.dataset.uuid);
            dragData = item.toDragData();
        }

        // Active Effect
        else if (li.dataset.effectId) {
            const effect = this.actor.effects.get(li.dataset.effectId);
            dragData = effect.toDragData();
        }

        // Action
        else if (li.dataset.actionName) {
            const action = this.actor.system.actions.getName(
                li.dataset.actionName,
            );
            dragData = action.toDragData();
        }

        if (!dragData) return;

        // Set data transfer
        event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    }
}

export class SohlActor extends Actor {
    $speaker;

    get speaker() {
        if (!this.$speaker) {
            this.$speaker = ChatMessage.getSpeaker({
                token: this.token,
                actor: this,
            });
        }
        return this.$speaker;
    }

    /**
     * Union of all owned items and virtual items
     */
    *allItems() {
        for (let it of this.items.values()) yield it;
        for (let it of this.system.virtualItems.values()) yield it;
    }

    /** @override */
    get itemTypes() {
        const types = Object.fromEntries(
            game.documentTypes.Item.map((t) => [t, []]),
        );
        const ary = IterWrap.create(this.allItems())
            .toArray()
            .sort((a, b) => a.sort - b.sort);
        const result = ary.reduce((obj, it) => {
            obj[it.type].push(it);
            return obj;
        }, types);

        return result;
    }

    get itemSubtypes() {
        const result = Object.values(HM.sysVer.CONFIG.Item.dataModels).reduce(
            (ist, clazz) => {
                // Only create a subtype list if there are, in fact, subtypes defined
                if (clazz.subTypes) {
                    ist[clazz.typeName] = Object.fromEntries(
                        Object.keys(clazz.subTypes).map((key) => [
                            key,
                            { label: clazz.subTypes[key], items: [] },
                        ]),
                    );
                }
                return ist;
            },
            {},
        );

        // Load up all subtype lists
        const ary = IterWrap.create(this.allItems())
            .toArray()
            .sort((a, b) => a.sort - b.sort);
        ary.forEach((it) => {
            if (it.system instanceof TraitItemData) {
                if (it.system.intensity !== "attribute") {
                    result.trait[it.system.subType].items.push(it);
                }
            } else if (it.system.subType) {
                if (!result[it.type]?.[it.system.subType]) {
                    console.error(
                        `Item ${it.id} type ${it.type} has invalid subtype ${it.system.subType}`,
                    );
                    result[it.type][it.system.subType] = {
                        label: `!!BAD!! ${it.system.subType}`,
                        items: [],
                    };
                }
                result[it.type][it.system.subType].items.push(it);
            }
        });

        return result;
    }

    get label() {
        return `Actor ${this.name}`;
    }

    get sunsign() {
        if (!this._sunsign) {
            const sunsignTrait = this.getTraitByAbbrev("ss");
            if (!sunsignTrait) {
                console.warn(`No Sunsign trait on actor ${this.name}`);
                return "";
            } else {
                this._sunsign = sunsignTrait.system.textValue;
            }
        }
        return this._sunsign;
    }

    /**
     * Try several things to determine what the current actor is.  These include: (1) if UUID is specified, find
     * the actor with that UUID; (2) If there is a combat ongoing, and if the current combatant is owned, then
     * select that actor, or (3) if there is a character defined in the user profile, choose that actor.
     *
     * @param {string} actorUuid
     * @returns The SohlActor that was identified.
     */
    static getActor(actorUuid = null) {
        let actor = null;

        if (actorUuid) {
            actor = fromUuidSync(actorUuid);
            if (!actor) {
                ui.notifications.warn(
                    `Cannot find actor with UUID ${actorUuid}`,
                );
                return null;
            }
        } else {
            // We have to guess which actor to select.
            // If in combat, then choose the combatant whose turn it is
            actor = game.combat?.combatant?.actor;
            if (!actor?.isOwner) {
                // If we're not an owner of the current combatant (or we are not in combat), then
                // fallback to our "user character" (if defined)
                actor = game.user.character;
                if (!actor) {
                    const msg = `Cannot identify a default character; please consider defining your default character in your user profile.`;
                    console.warn(`hm.SoHL | ${msg}`);
                    ui.notifications.warn(msg);
                    return null;
                }
            }
        }

        return actor;
    }

    /**
     * Finds the token associated with this actor.  If this actor is a synthetic actor,
     * then this is trivial.  But if this actor is not synthetic, then this method will
     * search through the current scene to find the appropriate token associated with this
     * actor.
     *
     * If a token in the current scene is selected, and it is linked to this actor, then it
     * is chosen.  If no token is selected, then choose one at random (in the best case there
     * will only be one linked token anyway).
     *
     * @returns {Token} the token associated with this actor
     */
    getToken() {
        // If this is a synthetic actor, then get the token associated with the actor
        let token = this.token;

        if (!token && canvas.tokens) {
            // Actor is a linked token
            // Case 1: A single token is selected, and it is the actor we are looking for
            if (
                canvas.tokens.controlled?.length == 1 &&
                canvas.tokens.controlled[0].actor.id === this.id
            ) {
                token = canvas.tokens.controlled[0];
            }

            if (!token) {
                // Case 2: Search all tokens on the active scene, and select the first
                // one found where the token's actor is the one we are looking for
                token ||= canvas.scene?.tokens.find(
                    (t) => t.actor.id === this.id,
                );
            }
        }
        return token;
    }

    /**
     * Determines the actor to handle a button event, based on who pressed the button.
     * Options are the sum of:
     * User's character actor.
     * If there is an active scene, all of the tokens on the active scene owned by the user.
     * All of the global actors which are owned by the user.
     * If the result is more than one actor, display a dialog asking the user to select one.
     *
     * @returns {SohlActor|null} one SohlActor document, or null if none can be found.
     */
    static async getHandlerActor() {
        const actors = [];

        // If the user has a character defined, add it to the list of actors
        if (game.user.character) {
            actors.push(game.user.character);
        }

        // Find all of the tokens on the canvas, and if the current user has ownership permission, add them to the list.
        canvas.tokens.placeables.forEach((token) => {
            if (token.actor?.testUserPermission(game.user, "OWNER")) {
                if (!actors.some((a) => a.id === token.actor.id))
                    actors.push(token.actor);
            }
        });

        // Find all of the global actors who the current user has OWNER permission for, and add them to the list.
        game.actors.forEach((actor) => {
            if (actor.testUserPermission(game.user, "OWNER")) {
                if (!actors.some((a) => a.id === actor.id)) actors.push(actor);
            }
        });

        if (actors.length === 0) return null;
        if (actors.length === 1) return actors[0].value;

        let dlghtml = `<form>
                <div class="form-group">
                    <label>Animate Entities:</label>
                    <select name="entity">`;

        actors.forEach((a, i) => {
            dlghtml += `<option value="${a.uuid}"${!i ? " selected" : ""}>${
                a.name
            }</option>`;
        });
        dlghtml += `</select></div></form>`;

        // Pop up the dialog to get the character selection
        const dlgResult = await Dialog.prompt({
            title: "Select Animate Entity",
            content: dlghtml.trim(),
            label: "OK",
            callback: (html) => {
                const form = html.querySelector("form");
                const fd = new FormDataExtended(form);
                const formData = foundry.utils.expandObject(fd.object);
                const actor = fromUuidSync(formData.entity);
                return actor;
            },
            rejectClose: false,
            options: { jQuery: false },
        });

        return dlgResult;
    }

    static defaultName({ type, parent, pack } = {}) {
        const documentName = this.metadata.name;
        let collection;
        if (parent) collection = parent.getEmbeddedCollection(documentName);
        else if (pack) collection = game.packs.get(pack);
        else collection = game.collections.get(documentName);
        const takenNames = new Set();
        for (const document of collection) takenNames.add(document.name);
        const baseName = CONFIG.Actor.typeLabels[type]
            ? CONFIG.Actor.typeLabels[type]
            : type;
        let name = baseName;
        let index = 1;
        while (takenNames.has(name)) name = `${baseName} (${++index})`;
        return name;
    }

    static async createDialog(
        data = {},
        { parent = null, pack = null, types, ...options } = {},
    ) {
        const cls = this.implementation;

        // Identify allowed types
        let documentTypes = [];
        let defaultType = CONFIG[this.documentName]?.defaultType;
        let defaultTypeAllowed = false;
        let hasTypes = false;
        if (this.TYPES.length > 1) {
            if (types?.length === 0)
                throw new Error(
                    "The array of sub-types to restrict to must not be empty",
                );

            // Register supported types
            for (const type of this.TYPES) {
                if (type === CONST.BASE_DOCUMENT_TYPE) continue;
                if (types && !types.includes(type)) continue;
                let label =
                    CONFIG[this.documentName]?.typeLabels?.[type] || type;
                documentTypes.push({ value: type, label });
                if (type === defaultType) defaultTypeAllowed = true;
            }
            if (!documentTypes.length)
                throw new Error(
                    "No document types were permitted to be created",
                );

            if (!defaultTypeAllowed) defaultType = documentTypes[0].value;
            // Sort alphabetically
            documentTypes.sort((a, b) =>
                a.label.localeCompare(b.label, game.i18n.lang),
            );
            hasTypes = true;
        }

        // Identify destination collection
        let collection;
        if (!parent) {
            if (pack) collection = game.packs.get(pack);
            else collection = game.collections.get(this.documentName);
        }

        // Collect data
        const folders = collection?._formatFolderSelectOptions() ?? [];
        const label = game.i18n.localize(this.metadata.label);
        const title = game.i18n.format("DOCUMENT.Create", { type: label });
        const type = data.type || defaultType;
        let userCompendiums = game.settings
            .get("hm", "searchActorCompendiums")
            .split(",")
            .map((s) => s.trim());
        const defaultAnimateEntity = game.settings.get(
            "hm",
            "defaultAnimateEntity",
        );

        const worldActors = game.actors.reduce((ary, actor) => {
            if (actor.type === "entity") {
                const elem = {
                    value: actor.uuid,
                    label: actor.name,
                };
                ary.push(elem);
            }
            return ary;
        }, []);

        const userPackActors = (
            await Utility.getDocsFromPacks(userCompendiums, {
                documentName: "Actor",
                docType: "entity",
            })
        ).reduce((ary, actor) => {
            const elem = {
                value: actor.uuid,
                label: actor.name,
            };
            ary.push(elem);
            return ary;
        }, []);

        const sysPackActors = (
            await Utility.getDocsFromPacks(HM.sysVer.CONFIG.Actor.compendiums, {
                documentName: "Actor",
                docType: "entity",
            })
        ).reduce((ary, actor) => {
            const elem = {
                value: actor.uuid,
                label: actor.name,
            };
            ary.push(elem);
            return ary;
        }, []);
        let defaultCloneActor = worldActors.find(
            (obj) => obj.label === defaultAnimateEntity,
        );
        defaultCloneActor ||= userPackActors.find(
            (obj) => obj.label === defaultAnimateEntity,
        );
        defaultCloneActor ||= sysPackActors.find(
            (obj) => obj.label === defaultAnimateEntity,
        );
        const allActors = {
            "Default Actors": [{ label: "None", value: "" }],
        };

        if (worldActors.length) {
            allActors["World Actors"] = worldActors.sort((a, b) =>
                a.label.localeCompare(b.label),
            );
        }

        if (userPackActors.length) {
            allActors["User Compendiums"] = userPackActors.sort((a, b) =>
                a.label.localeCompare(b.label),
            );
        }

        if (sysPackActors.length) {
            allActors["System Compendiums"] = sysPackActors.sort((a, b) =>
                a.label.localeCompare(b.label),
            );
        }

        if (defaultCloneActor) {
            allActors["Default Actors"].unshift({
                label: defaultCloneActor.label,
                value: defaultCloneActor.value,
            });
        }

        let content = `<div class="form-group" id="cloneActor">
        <label class="init-checkbox">Actor to Clone:</label>
        <select name="cloneActor">`;
        let hasSelected = false;
        Object.keys(allActors).forEach((group) => {
            if (allActors[group].length) {
                content += `<optgroup label=${group}>`;
                allActors[group].forEach((obj) => {
                    content += `<option value="${obj.value}"${!hasSelected ? " selected" : ""}>${obj.label}</option>`;
                    hasSelected = true;
                });
                content += "</optgroup>";
            }
        });
        content += `</select></div><div class="form-group" id="randomattrs">
        <label class="init-checkbox">Roll Attrs:</label>
        <select name="rollattrs" data-tooltip="Perform random rolls for attributes">
        <option value="" selected>No</option>
        <option value="default">Default</option>
        <option value="custom">Custom</option>
        </select>
        <input type="text" name="rollformula" disabled data-tooltip="Roll formula" />
        </div>`;

        // Render the document creation form
        const html = await renderTemplate(
            "templates/sidebar/document-create.html",
            {
                name: data.name || "",
                defaultName: this.implementation.defaultName({
                    type,
                    parent,
                    pack,
                }),
                hasTypes: this.hasTypeData,
                types: documentTypes,
                type,
                hasFolders: folders.length > 1,
                folders,
                folder: data.folder,
                content,
            },
        );

        // Render the confirmation dialog window
        return Dialog.prompt({
            title,
            content: html,
            label: title,
            render: (html) => {
                if (!hasTypes) return;
                const doc = html[0];
                doc.querySelector('[name="rollattrs"]').addEventListener(
                    "change",
                    (e) => {
                        const rollFormula = doc.querySelector(
                            '[name="rollformula"]',
                        );
                        if (e.target.value === "custom") {
                            rollFormula.placeholder = "e.g. 4d6kh3";
                            rollFormula.disabled = false;
                        } else {
                            rollFormula.placeholder = "";
                            rollFormula.disabled = true;
                        }
                    },
                );
                doc.querySelector('[name="type"]').addEventListener(
                    "change",
                    (e) => {
                        const nameInput = doc.querySelector('[name="name"]');
                        nameInput.placeholder = cls.defaultName({
                            type: e.target.value,
                            parent,
                            pack,
                        });
                        const isAnimateEntity = e.target.value === "entity";
                        if (isAnimateEntity) {
                            doc.querySelector("#cloneActor").style.visibility =
                                "visible";
                            doc.querySelector("#randomattrs").style.visibility =
                                "visible";
                        } else {
                            doc.querySelector("#cloneActor").style.visibility =
                                "hidden";
                            doc.querySelector("#randomattrs").style.visibility =
                                "hidden";
                        }
                    },
                );
            },
            callback: (html) => {
                const form = html[0].querySelector("form");
                const fd = new FormDataExtended(form);
                data.name = fd.object.name;
                data.type = fd.object.type;
                data.folder = fd.object.folder;
                const cloneActorUuid = fd.object.cloneActor;
                const rollAttrs = fd.object.rollattrs;
                const rollFormula =
                    rollAttrs === "custom" ? fd.object.rollformula : rollAttrs;
                if (!data.folder) delete data["folder"];
                if (documentTypes.length === 1) data.type = documentTypes[0];
                if (!data.name?.trim())
                    data.name = cls.defaultName({
                        type: data.type,
                        parent,
                        pack,
                    });
                return this.create(data, {
                    parent,
                    pack,
                    renderSheet: true,
                    cloneActorUuid,
                    rollFormula,
                });
            },
            rejectClose: false,
            options,
        });
    }

    /** @override */
    async _preCreate(createData, options, user) {
        const allowed = await super._preCreate(createData, options, user);
        if (allowed === false) return false;

        const similarActorExists =
            !this.pack &&
            game.actors.some(
                (actor) =>
                    actor.type === createData.type &&
                    actor.name === createData.name,
            );
        if (similarActorExists) {
            ui.notifications.warn(
                `An ${SohlItemTypeLabels[createData.type]} with identical name ("${createData.name}") already exists, cannot create.`,
            );
            return false;
        }

        // If the created actor has items (only applicable to duplicated actors) bypass the new actor creation logic
        if (options.skipDefaults || createData.items) return;

        let updateData = {};

        if (options.cloneActorUuid) {
            const cloneActor = await fromUuid(options.cloneActorUuid);
            if (cloneActor) {
                let newData = cloneActor.toObject();
                delete newData._id;
                delete newData.folder;
                delete newData.sort;
                delete newData.pack;
                if ("ownership" in newData) {
                    newData.ownership = {
                        default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
                        [game.user.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
                    };
                }

                updateData = foundry.utils.mergeObject(newData, createData);
            }
        }

        const artwork = this.constructor.getDefaultArtwork(this.toObject());
        updateData["img"] ||= artwork.img;
        updateData["prototypeToken.texture.src"] ||= artwork.texture.src;

        // If a rollFormula is provided, then we will perform the designated rolling
        // for all attributes, and then for all skills we will calculate the initial
        // mastery level based on those attributes.
        if (options.rollFormula) {
            for (const obj of updateData.items) {
                if (
                    options.rollFormula &&
                    obj.type === "trait" &&
                    obj.system.intensity === "attribute"
                ) {
                    const rollFormula =
                        (options.rollFormula === "default"
                            ? obj.flags?.hm?.diceFormula
                            : options.rollFormula) || "0";

                    let roll = await Roll.create(rollFormula).evaluate();
                    if (!roll) {
                        ui.notifications.error(
                            `Roll formula "${rollFormula}" is invalid`,
                        );
                        return false;
                    }
                    obj.system.textValue = roll.total.toString();
                }
            }

            // Calculate initial skills mastery levels
            for (const obj of updateData.items) {
                if (obj.type === "skill") {
                    if (obj.flags?.hm?.kethira?.initSkillMult) {
                        const sb = new SkillBase(obj.system.skillBaseFormula, {
                            items: updateData.items,
                        });
                        obj.system.masteryLevelBase =
                            sb.value * obj.flags.hm.kethira.initSkillMult;
                    }
                }
            }
        }

        this.updateSource(updateData);

        return true;
    }

    _onCreate(data, options, userId) {
        super._onCreate(data, options, userId);
        this.updateEffectsOrigin();
    }

    _onSortItem(event, itemData) {
        // Get the drag source and drop target
        const source = IterWrap.create(this.allItems()).find(
            (it) => it.id === itemData._id,
        );
        const dropTarget = event.target.closest("[data-item-id]");
        if (!dropTarget) return;
        const target = IterWrap.create(this.allItems()).find(
            (it) => it.id === dropTarget.dataset.itemId,
        );

        // Don't sort on yourself
        if (source.id === target.id) return;

        // Identify sibling items based on adjacent HTML elements
        const siblings = [];
        for (let el of dropTarget.parentElement.children) {
            const siblingId = el.dataset.itemId;
            if (siblingId && siblingId !== source.id)
                siblings.push(
                    IterWrap.create(this.allItems()).find(
                        (it) => it.id === el.dataset.itemId,
                    ),
                );
        }

        // Perform the sort
        const sortUpdates = SortingHelpers.performIntegerSort(source, {
            target,
            siblings,
        });

        sortUpdates.forEach((u) => {
            const update = u.update;
            const item = this.getItem(u.target._id);
            item.update(update);
        });
    }

    prepareEmbeddedDocuments() {
        // The Actor#prepareEmbeddedDocuments method performs Active Effect processing after
        // preparing the embedded documents, but we don't want that.  So we fully override to
        // put back in the basic implementation from ClientDocument.
        for (const collectionName of Object.keys(
            this.constructor.hierarchy || {},
        )) {
            for (let e of this.getEmbeddedCollection(collectionName)) {
                e._safePrepareData();
            }
        }

        // At this point, the virtual items list is empty.  We now go through
        // all of the "owned" items and request them to setup any virtual items they need.
        // Any of those items that setup virtual items will have "setupVirtualItems" called
        // when they are added to the Virtual Items list.
        for (const it of this.allItems()) {
            it.system.execute("Setup Virtual Items", { inPrepareData: true });
            if (it instanceof GearItemData) {
                Hooks.callAll(`gearSetupVirtualItems`, it.system);
            }
            Hooks.callAll(`${it.type}SetupVirtualItems`, it.system);
        }

        // Apply item active effects
        IterWrap.create(this.allItems()).forEach((it) => {
            it.applyActiveEffects();
        });

        // Apply actor active effects
        this.applyActiveEffects();

        // Process any item activities that require access to sibling items
        // Prior to this point accessing item siblings is unsafe
        for (const it of this.allItems()) {
            it.system.execute("Process Siblings", { inPrepareData: true });
            if (it instanceof GearItemData) {
                Hooks.callAll(`gearProcessSiblings`, it.system);
            }
            Hooks.callAll(`${it.type}ProcessSiblings`, it.system);
        }
    }

    prepareDerivedData() {
        super.prepareDerivedData();

        // Perform final processing of all items after the actor's
        // derived data has all been completed.
        for (const it of this.allItems()) {
            it.system.execute("Post-Process", { inPrepareData: true });
            if (it instanceof GearItemData) {
                Hooks.callAll(`gearPostProcess`, it.system);
            }
            Hooks.callAll(`${it.type}PostProcess`, it.system);
        }
    }

    async updateEffectsOrigin() {
        // If we are in a compendium, do nothing
        if (this.pack) return;

        const actorUpdate = this.effects.reduce((toUpdate, e) => {
            if (e.origin !== this.uuid) {
                return toUpdate.concat({ _id: e.id, origin: this.uuid });
            }
            return toUpdate;
        }, []);
        if (actorUpdate.length) {
            await this.updateEmbeddedDocuments("ActiveEffect", actorUpdate);
        }

        for (const it of this.items) {
            const toUpdate = it.updateEffectsOrigin();
            if (toUpdate.length) {
                await it.updateEmbeddedDocuments("ActiveEffect", toUpdate);
            }
        }

        this.system.virtualItems.forEach((it) => {
            const toUpdate = it.updateEffectsOrigin();
            while (toUpdate.length) {
                const eChange = toUpdate.pop();
                const effect = it.effects.get(eChange._id);
                if (effect) {
                    effect.update({ origin: eChange.origin });
                }
            }
        });
    }

    /**
     *
     * @param {string} name Name of combat skill to find
     * @returns {MasteryLevelModifier} clone of MasteryLevelModifier of combat skill
     */
    getCombatStat(name) {
        const combatSkill = this.itemTypes[SkillItemData.typeName].find(
            (it) => it.system.type === "Combat" && it.name === name,
        );
        if (combatSkill) {
            return combatSkill.system.$masteryLevel;
        } else {
            return new MasteryLevelModifier(this.system).set(
                `No ${name} Combat Skill`,
                "NoSkill",
                0,
            );
        }
    }

    /**
     * Get a reference to the trait item on the actor.
     *
     * @param {string} abbrev Abbreviation of trait Item to find
     * @returns {SohlItem} SohlItem of the trait.
     */
    getTraitByAbbrev(abbrev) {
        const result = IterWrap.create(this.allItems()).find(
            (it) =>
                it.system instanceof TraitItemData &&
                it.system.abbrev === abbrev,
        );
        return result;
    }

    /**
     * Get a reference to the trait item on the actor.
     *
     * @param {string} abbrev Abbreviation of trait Item to find
     * @returns {SohlItem} SohlItem of the trait.
     */
    getSkillByAbbrev(abbrev) {
        const result = IterWrap.create(this.allItems()).find(
            (it) =>
                it.system instanceof SkillItemData &&
                it.system.abbrev === abbrev,
        );
        return result;
    }

    /**
     * Finds an Item by name or UUID. If name is provided, searches within the specified actor.
     *
     * @param {String} itemName Either an item id, an item UUID, or an item name
     * @param {String} type The type of Item (e.g., "weapongear")
     */
    getItem(itemName, { types = [] } = {}) {
        if (!itemName) {
            throw new Error(`Must specify a name, id, or UUID`);
        }

        const typeNames =
            types
                .map((t) => HM.sysVer.CONFIG.Item.typeLabels[t])
                .join(" or ") || "item";

        let item = null;
        if (itemName.includes(".")) {
            // The name may be a UUID since it contains a dot
            item = fromUuidSync(itemName);
            if (
                item &&
                !(item instanceof SohlItem && item.actor.id === this.id)
            ) {
                throw new Error(
                    `${itemName} does not refer to an item in actor ${this.name}`,
                );
            }
        }

        if (!item) {
            // Not an item UUID, so we assume it must be an item id or name.

            let items = [];
            if (types?.length) {
                // Type(s) have been specified, so we can use these as a hint as to where to look
                // for the items.
                IterWrap.create(this.allItems()).forEach((it) => {
                    if (types.includes(it.type) && it.name === itemName) {
                        items.push(it);
                    }
                });
            } else {
                // No types have been specified, so our only option is to assume it is an item ID and look for that
                for (let candidate of this.allItems()) {
                    if (candidate.id === itemName) {
                        items = [candidate];
                        break;
                    }
                }
            }

            if (items.length > 1) {
                ui.notifications.warn(
                    `Actor ${
                        this.token?.name || this.name
                    } has more than one ${typeNames} with name ${itemName}. The first matched item will be chosen.`,
                );
            } else if (items.length === 0) {
                ui.notifications.warn(
                    `Actor ${
                        this.token?.name || this.name
                    } does not have an ${typeNames} named ${itemName}`,
                );
                return null;
            }

            // Filter returns potentially multiple matches; so just choose the
            // first one as the result (there really should be only one result
            // anyway, or the name is ambiguous).
            item = items[0];
        }

        if (!item || (types.length && !types.includes(item.type))) {
            ui.notifications.warn(
                `Actor ${
                    this.token?.name || this.name
                } does not have an ${typeNames} named ${itemName}`,
            );
            return null;
        }

        return item;
    }

    isValidItem(item, types = []) {
        if (!(item?.system instanceof SohlItemData)) {
            throw new Error(`Provided object is not a valid Item`);
        }

        if (!types.includes(item.type)) {
            throw new Error(
                `Item ${item.system.typeLabel.singular} must be one of "${types
                    .map((t) => HM.sysVer.CONFIG.Item.typeLabels[t])
                    .join(", ")}" but type is ${
                    HM.sysVer.CONFIG.Item.typeLabels[item.type]
                }`,
            );
        }
    }

    /**
     * Gathers all effects from all items that are targeting the Actor and returns them as an array.
     *
     * @readonly
     * @type {*}
     */
    get transferredEffects() {
        // Gather all of the effects from all items that are targeting the Actor
        const transferredEffects = IterWrap.create(this.allItems()).reduce(
            (effects, it) => {
                const actorEffects = it.effects.filter(
                    (e) => e.system.targetType === "actor",
                );
                return effects.concat(actorEffects);
            },
            [],
        );

        return transferredEffects;
    }

    *allApplicableEffects() {
        // Grab all of the effects on this actor that affect this actor
        const effects = this.effects.filter(
            (e) => e.system.targetType === "this",
        );
        for (const effect of effects) {
            yield effect;
        }

        // Add all of the transferred effects from the items that affect this actor
        for (const effect of this.transferredEffects) {
            yield effect;
        }
    }

    /**
     * Apply all active effects to the actor, including special statuses, effects from items, and transferred effects. Update overrides and special statuses for the actor and its items accordingly.
     */
    applyActiveEffects() {
        const overrides = {
            [this.id]: {},
        };

        this.statuses ??= new Set();

        // Identify which special statuses had been active
        const specialStatuses = new Map();
        for (const statusId of Object.values(CONFIG.specialStatusEffects)) {
            specialStatuses.set(statusId, this.statuses.has(statusId));
        }
        this.statuses.clear();

        // Organize non-disabled effects by their application priority
        const changes = [];
        for (const effect of this.allApplicableEffects()) {
            if (!effect.active) continue;
            const targets = effect.targets;
            if (!targets.length) continue;
            changes.push(
                ...effect.changes.map((change) => {
                    const c = foundry.utils.deepClone(change);
                    c.targets = targets;
                    c.effect = effect;
                    c.priority = c.priority ?? c.mode * 10;
                    return c;
                }),
            );
            for (const statusId of effect.statuses) this.statuses.add(statusId);
        }
        changes.sort((a, b) => a.priority - b.priority);

        // Apply all changes
        for (let change of changes) {
            if (!change.key) continue;
            if (!change.targets?.length) continue;
            change.targets.forEach((t) => {
                const changes = change.effect.apply(t, change);
                if (Object.keys(changes).length) {
                    if (typeof overrides[t.id] === "object")
                        foundry.utils.mergeObject(overrides[t.id], changes);
                    else overrides[t.id] = changes;
                }
            });
        }

        // Expand the set of final overrides
        this.overrides = foundry.utils.expandObject(overrides[this.id]);
        IterWrap.create(this.allItems()).forEach((it) => {
            if (overrides[it.id])
                it.overrides = foundry.utils.expandObject(overrides[it.id]);
        });

        // Apply special statuses that changed to active tokens
        let tokens;
        for (const [statusId, wasActive] of specialStatuses) {
            const isActive = this.statuses.has(statusId);
            if (isActive === wasActive) continue;
            tokens ??= this.getActiveTokens();
            for (const token of tokens)
                token._onApplyStatusEffect(statusId, isActive);
        }
    }

    /**
     * Executes the checkAndExecute method for EventItemData instances in the allItems array and checks and disables expired effects for each item in the allItems array as well as the effects array.
     */
    timeChangeWork() {
        IterWrap.create(this.allItems()).forEach((it) => {
            if (it.system instanceof EventItemData) it.checkAndExecute();
            it.effects.forEach((effect) => effect.checkExpiredAndDisable());
        });
        this.effects.forEach((effect) => effect.checkExpiredAndDisable());
    }

    /**
     * Add all of the items from a pack with the specified names to this actor
     * @param {String[]} itemNames Array of item names to include
     * @param {String} packName Name of compendium pack containing items
     * @param {Object[]} items array of ItemData elements to populate
     */
    static async _addItemsFromPack(
        itemNames,
        packNames,
        { itemType, keepId } = {},
    ) {
        let itNames = foundry.utils.deepClone(itemNames);
        const itemAry = [];
        for (let itName of itNames) {
            const data = await Utility.getItemFromPacks(itName, packNames, {
                itemType,
                keepId,
            });
            if (data) itemAry.push(data);
        }

        return itemAry;
    }

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    static async fromDropData(data, options = {}) {
        let document = null;

        // Case 1 - Data explicitly provided
        if (data.data) document = new this(data.data);
        // Case 2 - UUID provided
        else if (data.uuid) document = await fromUuid(data.uuid);

        // Ensure that we retrieved a valid document
        if (!document) {
            throw new Error(
                "Failed to resolve Document from provided DragData. Either data or a UUID must be provided.",
            );
        }
        if (document.documentName !== this.documentName) {
            throw new Error(
                `Invalid Document type '${document.type}' provided to ${this.name}.fromDropData.`,
            );
        }

        // Flag the source UUID
        if (document.id && !document._stats?.compendiumSource) {
            let uuid = document.uuid.split("#").at(0);
            document.updateSource({ "_stats.compendiumSource": uuid });
        }
        return document;
    }
}

function SohlSheetMixin(Base) {
    return class SohlSheet extends Base {
        /** @override */
        static get defaultOptions() {
            return foundry.utils.mergeObject(super.defaultOptions, {
                tabs: [
                    {
                        navSelector: ".sheet-tabs",
                        contentSelector: ".sheet-body",
                        initial: "properties",
                    },
                ],
                dragDrop: [
                    { dragSelector: ".item-list .item", dropSelector: null },
                ],
            });
        }

        get template() {
            return this.document.system.constructor.sheet;
        }

        getData() {
            const data = super.getData();
            data.const = HM.sysVer.CONST;
            data.config = HM.sysVer.CONFIG;
            data.owner = this.document.isOwner;
            data.limited = this.document.limited;
            data.options = this.options;
            data.editable = this.isEditable;
            data.cssClass = data.owner ? "editable" : "locked";
            data.isAnimateEntity =
                this.document.system instanceof AnimateEntityActorData;
            data.isInanimateObject =
                this.document.system instanceof InanimateObjectActorData;
            data.actor =
                this.document instanceof SohlActor
                    ? this.document
                    : this.document.actor;
            data.flags = this.document.flags;
            data.system = this.document.system;
            data.isGM = game.user.isGM;
            data.fields = this.document.system.schema.fields;

            data.effects = this.document.effects;

            // Collect all effects from other Items/Actors that are affecting this item
            data.transferredEffects = {};
            this.document.transferredEffects.forEach((effect) => {
                if (!effect.disabled) {
                    data.transferredEffects[effect.id] = effect;
                }
            });

            return data;
        }

        /** @override */
        // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        _onSearchFilter(event, query, rgx, html) {
            if (!html) return;
            const visibleCategories = new Set();

            for (const entry of html.querySelectorAll(".item")) {
                if (!query) {
                    entry.classList.remove("hidden");
                    continue;
                }

                const name = entry.dataset.itemName;
                const match = name && rgx.test(SearchFilter.cleanQuery(name));
                entry.classList.toggle("hidden", !match);
                if (match)
                    visibleCategories.add(
                        entry.parentElement.parentElement.dataset.category,
                    );
            }

            for (const category of html.querySelectorAll(".category")) {
                category.classList.toggle(
                    "hidden",
                    query && !visibleCategories.has(category.dataset.category),
                );
            }
        }

        _contextMenu(html) {
            new SohlContextMenu(html, ".item", [], {
                onOpen: this._onItemContextMenuOpen.bind(this),
            });
            new SohlContextMenu(html, ".item-contextmenu", [], {
                eventName: "click",
                onOpen: this._onItemContextMenuOpen.bind(this),
            });
            new SohlContextMenu(html, ".effect", [], {
                onOpen: this._onEffectContextMenuOpen.bind(this),
            });
            new SohlContextMenu(html, ".effect-contextmenu", [], {
                eventName: "click",
                onOpen: this._onEffectContextMenuOpen.bind(this),
            });
        }

        _onItemContextMenuOpen(element) {
            let ele = element.closest("[data-item-id]");
            if (!ele) return;
            ele = ele instanceof HTMLElement ? ele : ele[0];
            const actionName = ele?.dataset.actionName;
            const docId = ele?.dataset.itemId;
            let doc;
            if (actionName) {
                doc = this.document.system.actions.get(docId);
            } else {
                doc =
                    this.document instanceof SohlItem
                        ? this.document.getNestedItemById(docId)
                        : this.document instanceof SohlActor
                          ? this.document.getItem(docId)
                          : null;
            }
            ui.context.menuItems = doc
                ? this.constructor._getContextOptions(doc)
                : [];
        }

        _onEffectContextMenuOpen(element) {
            let ele = element.closest("[data-effect-id]");
            if (!ele) return;
            ele = ele instanceof HTMLElement ? ele : ele[0];
            const effectId = ele?.dataset.effectId;
            const effect = this.document.effects.get(effectId);
            ui.context.menuItems = effect
                ? this.constructor._getContextOptions(effect)
                : [];
        }

        /**
         * Retrieve the context options for the given item. Sort the menu items based on groups, with items having no group at the top, items in the 'primary' group in the middle, and items in the 'secondary' group at the bottom.
         *
         * @static
         * @param {*} doc
         * @returns {*}
         */
        static _getContextOptions(doc) {
            const result =
                doc.system instanceof SohlBaseData
                    ? doc.system._getContextOptions()
                    : doc._getContextOptions();

            // Sort the menu items according to group.  Expect items with no group
            // at the top, items in the "primary" group next, and items in the
            // "secondary" group last.
            const collator = new Intl.Collator("en-US");
            result.sort(collator.compare);
            return result;
        }

        async _onEffectToggle(event) {
            const li = event.currentTarget.closest(".effect");
            const effect = this.document.effects.get(li.dataset.effectId);
            return await effect.toggleEnabledState();
        }

        async _onEffectCreate() {
            const dlgTemplate =
                "systems/hm/templates/dialog/active-effect-start.html";
            const dialogData = {
                gameTime: game.time.worldTime,
            };
            if (HM.hasSimpleCalendar) {
                const ct = SimpleCalendar.api.timestampToDate(
                    dialogData.gameTime,
                );
                dialogData.gameTime = `${ct.display.day} ${ct.display.monthName} ${ct.display.yearPrefix}${ct.display.year}${ct.display.yearPostfix} ${ct.display.time}`;
            }

            if (game.combat) {
                dialogData.combatId = game.combat.id;
                dialogData.combatRound = game.combat.round;
                dialogData.combatTurn = game.combat.turn;
            }
            const html = await renderTemplate(dlgTemplate, dialogData);

            // Create the dialog window
            return await Dialog.prompt({
                title: "Create Event",
                content: html,
                label: "OK",
                render: (html) => {
                    const worldTime = html.querySelector("#worldTime");
                    const combatTime = html.querySelector("#combatTime");

                    html.querySelector("[name='startType']").addEventListener(
                        "click",
                        (ev) => {
                            if (ev.currentTarget.value === "worldTime") {
                                worldTime.style.visibility = "visible";
                                combatTime.style.visibility = "hidden";
                            } else {
                                worldTime.style.visibility = "hidden";
                                combatTime.style.visibility = "visible";
                            }
                        },
                    );
                    html.querySelector(".alter-time").addEventListener(
                        "click",
                        (ev) => {
                            let time = Number.parseInt(
                                ev.currentTarget.dataset.time,
                                10,
                            );
                            if (Number.isNaN(time)) time = game.time.worldTime;
                            Utility.onAlterTime(time).then((result) => {
                                if (result !== null) {
                                    const updateData = {
                                        "duration.startTime": result,
                                    };
                                    this.object.update(updateData);
                                }
                            });
                        },
                    );
                },
                callback: async (html) => {
                    const form = html.querySelector("#active-effect-start");
                    const fd = new FormDataExtended(form);
                    const formdata = fd.object;
                    const startType = formdata.startType;
                    const formStartTime =
                        Number.parseInt(formdata.startTime, 10) ||
                        game.time.worldTime;
                    const formDuration =
                        Number.parseInt(formdata.duration, 10) || 1;
                    const formCombatRound =
                        Number.parseInt(formdata.combatRound, 10) ||
                        dialogData.combatRound;
                    const formCombatTurn =
                        Number.parseInt(formdata.combatTurn, 10) ||
                        dialogData.combatTurn;
                    const formCombatDurationRounds =
                        Number.parseInt(formdata.combatDurationRounds, 10) || 1;
                    const formCombatDurationTurns =
                        Number.parseInt(formdata.combatDurationTurns, 10) || 0;
                    const aeData = {
                        name: "New Effect",
                        type: SohlActiveEffectData.typeName,
                        icon: SohlActiveEffectData.defaultImage,
                        origin: this.document.uuid,
                        "system.targetName": formdata.targetName,
                        "system.targetType": formdata.targetType,
                    };
                    if (startType === "worldTime") {
                        aeData["duration.startTime"] = formStartTime;
                        aeData["duration.seconds"] = formDuration;
                    } else if (startType === "combatTime") {
                        aeData["duration.combat"] = dialogData.combatId;
                        aeData["duration.startRound"] = formCombatRound;
                        aeData["duration.startTurn"] = formCombatTurn;
                        aeData["duration.rounds"] = formCombatDurationRounds;
                        aeData["duration.turns"] = formCombatDurationTurns;
                    }
                    return SohlActiveEffect.create(aeData, {
                        parent: this.document,
                    });
                },
                rejectClose: false,
                options: { jQuery: false },
            });
        }

        /** @inheritdoc */
        _onDragStart(event) {
            const li = event.currentTarget;
            if ("link" in event.target.dataset) return;

            // Create drag data
            let dragData;

            // Owned Items
            if (li.dataset.uuid) {
                const item = fromUuidSync(li.dataset.uuid);
                dragData = item.toDragData();
            }

            // Active Effect
            else if (li.dataset.effectId) {
                const effect = this.actor.effects.get(li.dataset.effectId);
                dragData = effect.toDragData();
            }

            // Action
            else if (li.dataset.actionName) {
                const action = this.actor.system.actions.getName(
                    li.dataset.actionName,
                );
                dragData = action.toDragData();
            }

            if (!dragData) return;

            // Set data transfer
            event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
        }

        /** @override */
        async _onDropItem(event, data) {
            if (!this.document.isOwner) return false;

            const droppedItem = await SohlItem.fromDropData(data);
            if (!droppedItem) return false;

            if (droppedItem.system instanceof GearItemData) {
                const destContainerId = event.target.closest(
                    "[data-container-id]",
                )?.dataset.containerId;

                // If no other container is specified, use this item
                let destContainer;
                if (this.document instanceof SohlItem) {
                    destContainer = !destContainerId
                        ? this.document
                        : this.document.actor?.items.get(destContainerId) ||
                          this.document.getNestedItemById(destContainerId) ||
                          this.document;
                } else {
                    destContainer = !destContainerId
                        ? this.document
                        : this.document.items.get(destContainerId);
                }

                return await this._onDropGearItem(
                    event,
                    droppedItem,
                    destContainer,
                );
            } else {
                // Dropped item is not gear
                if (
                    droppedItem.nestedIn?.id === this.document.id ||
                    droppedItem.parent?.id === this.document.id
                ) {
                    // Sort items
                    return this.document._onSortItem(
                        event,
                        droppedItem.toObject(),
                    );
                } else {
                    if (this.document instanceof SohlActor) {
                        const newItem = await SohlItem.create(
                            droppedItem.toObject(),
                            {
                                parent: this.document,
                            },
                        );
                        if (!droppedItem.fromCompendiumOrWorld) {
                            await droppedItem.delete();
                        }
                        return newItem;
                    } else {
                        // Nest the dropped item into this item
                        return await droppedItem.nestIn(this.document, {
                            droppedItem,
                            destructive: !droppedItem.fromCompendiumOrWorld,
                        });
                    }
                }
            }
        }

        /** @override */
        async _onDropItemCreate(data, event) {
            if (!this.document.isOwner) return false;

            const isActor = this.document instanceof SohlActor;
            const items = isActor
                ? this.document.items
                : this.document.system.items;

            const itemList = data instanceof Array ? data : [data];
            const toCreate = [];
            for (let itemData of itemList) {
                // Body items cannot be placed directly on actor; these must always be
                // in an Anatomy object instead
                if (isActor && itemData.type.startsWith("body")) {
                    ui.notifications.warn(
                        `You may not drop a ${
                            HM.sysVer.CONFIG.Item.typeLabels[itemData.type]
                        } onto an Actor`,
                    );
                    return false;
                }

                // Determine if a similar item exists
                let similarItem;
                if (isActor && itemData.type === AnatomyItemData.typeName) {
                    // Only one Anatomy item is allowed to be on an actor at any time,
                    // so any existing one will be considered "similar".
                    similarItem = items.find(
                        (it) => it.type === AnatomyItemData.typeName,
                    );
                }

                if (!similarItem) {
                    similarItem = items.find(
                        (it) =>
                            it.name === itemData.name &&
                            it.type === itemData.type &&
                            it.system.subType === itemData.system.subType,
                    );
                }

                if (similarItem) {
                    const confirm = await Dialog.confirm({
                        title: `Confirm Overwrite: ${similarItem.label}`,
                        content: `<p>Are You Sure?</p><p>This item will be overwritten and cannot be recovered.</p>`,
                        options: { jQuery: false },
                    });
                    if (confirm) {
                        delete itemData._id;
                        delete itemData.pack;
                        let result = await similarItem.delete();
                        if (result) {
                            result = await this.document.constructor.create(
                                itemData,
                                {
                                    parent: isActor
                                        ? this.document
                                        : this.document.actor,
                                    clean: true,
                                },
                            );
                        } else {
                            ui.notifications.warn("Overwrite failed");
                            continue;
                        }
                        toCreate.push(itemData);
                    }
                } else {
                    toCreate.push(itemData);
                }
            }

            return super._onDropItemCreate(toCreate, event);
        }

        async _onDropGearItem(event, droppedItem, destContainer) {
            if (
                (destContainer instanceof SohlItem &&
                    destContainer.id === droppedItem.nestedIn?.id) ||
                (destContainer instanceof SohlActor &&
                    destContainer.id === droppedItem.parent?.id)
            ) {
                // If dropped item is already in a container and
                // source and dest containers are the same,
                // then we are simply rearranging
                return await destContainer._onSortItem(
                    event,
                    droppedItem.toObject(),
                );
            }

            if (droppedItem.id === destContainer.id) {
                // Prohibit moving a container into itself
                ui.notifications.warn("Can't move a container into itself");
                return false;
            }

            const items =
                destContainer instanceof SohlItem
                    ? destContainer.system.items
                    : destContainer.items;
            const similarItem = items.find(
                (it) =>
                    droppedItem.id === it.id ||
                    (droppedItem.name === it.name &&
                        droppedItem.type === it.type),
            );

            if (similarItem) {
                ui.notifications.error(
                    `Similar item exists in ${destContainer.name}`,
                );
                return false;
            }

            let quantity = droppedItem.system.quantity;
            if (quantity > 1 && !droppedItem.parent) {
                // Ask how many to move
                quantity = await Utility.moveQtyDialog(
                    droppedItem,
                    destContainer,
                );
            }

            return await droppedItem.nestIn(destContainer, {
                quantity,
                destructive: true,
            });
        }

        async _addPrimitiveSetItem(event) {
            const dataset = event.currentTarget.dataset;
            let newSet = foundry.utils.getProperty(
                this.document,
                dataset.array,
            );
            let defaultValue = dataset.defaultValue;
            const datatype = dataset.dtype;
            const choices = dataset.choices;
            if (["Number", "String"].includes(dataset.dtype)) {
                if (dataset.dtype === "Number")
                    defaultValue = Number.parseFloat(defaultValue) || 0;
                const dialogData = {
                    valueName: dataset.title,
                    newValue: defaultValue,
                    choices,
                };

                const compiled = Handlebars.compile(`<form id="value">
                <div class="form-group">
                    <label>{{valueName}}</label>
                    {{#if choices}}
                    <select name="newValue">
                        {{#selectOptions choices selected=newValue}}
                    </select>
                    {{else}}
                    <input
                        type="{{#if (eq type 'Number')}}number{{else}}text{{/if}}"
                        name="newValue"
                        value="{{newValue}}" />
                    {{/if}}
                </div>
                </form>`);
                const html = compiled(dialogData, {
                    allowProtoMethodsByDefault: true,
                    allowProtoPropertiesByDefault: true,
                });

                const dlgResult = await Dialog.prompt({
                    title: dataset.title,
                    content: html.trim(),
                    label: `Add ${dataset.title}`,
                    callback: (html) => {
                        const form = html.querySelector("form");
                        const fd = new FormDataExtended(form);
                        const formData = foundry.utils.expandObject(fd.object);
                        let formValue = formData.newValue;
                        if (datatype === "Number") {
                            formValue = Number.parseFloat(formValue);
                            if (Number.isNaN(formValue))
                                formValue = dataset.defaultValue;
                        }
                        return formValue;
                    },
                    rejectClose: false,
                    options: { jQuery: false },
                });

                // if dialog was closed, do nothing
                if (!dlgResult) return null;

                if (!newSet.has(dlgResult)) {
                    newSet.set(dlgResult);
                    const updateData = { [dataset.array]: newSet };
                    const result = await this.item.update(updateData);
                    if (result) this.render();
                }
            }
        }

        async _addAimArrayItem(event) {
            const dataset = event.currentTarget.dataset;
            let array = foundry.utils
                .getProperty(this.document, dataset.array)
                .concat();
            const compiled = Handlebars.compile(`<form id="aim">
        <div class="form-group flexrow">
            <div class="flexcol">
                <label>Name</label>
                <input type="text" name="name" />
            </div><div class="flexcol">
                <label>Prob Weight Base</label>
                {{numberInput 0 name="probWeightBase" min=0 step=1}}
            </div></div></form>`);
            const html = compiled(
                {},
                {
                    allowProtoMethodsByDefault: true,
                    allowProtoPropertiesByDefault: true,
                },
            );

            const dlgResult = await Dialog.prompt({
                title: dataset.title,
                content: html.trim(),
                label: `Add ${dataset.title}`,
                callback: (html) => {
                    const form = html.querySelector("form");
                    const fd = new FormDataExtended(form);
                    const formData = foundry.utils.expandObject(fd.object);
                    const result = {
                        name: formData.name,
                        probWeightBase:
                            Number.parseInt(formData.probWeightBase, 10) || 0,
                    };
                    return result;
                },
                rejectClose: false,
                options: { jQuery: false },
            });

            // if dialog was closed, do nothing
            if (!dlgResult) return null;

            if (array.some((a) => a.name === dlgResult.name)) {
                ui.notifications.warn(
                    `Aim with name "${dlgResult.name} already exists, ignoring`,
                );
                return null;
            }

            array.push(dlgResult);
            const updateData = { [dataset.array]: array };
            const result = await this.item.update(updateData);
            return result;
        }

        async _addValueDescArrayItem(event) {
            const dataset = event.currentTarget.dataset;
            let array = foundry.utils
                .getProperty(this.document, dataset.array)
                .concat();
            const compiled = Handlebars.compile(`<form id="aim">
                <div class="form-group flexrow">
                    <div class="flexcol">
                        <label>Label</label>
                        <input type="text" name="label" />
                    </div><div class="flexcol">
                        <label>Max Value</label>
                        {{numberInput 0 name="maxValue" min=0 step=1}}
                    </div></div></form>`);
            const html = compiled(
                {},
                {
                    allowProtoMethodsByDefault: true,
                    allowProtoPropertiesByDefault: true,
                },
            );

            const dlgResult = await Dialog.prompt({
                title: dataset.title,
                content: html.trim(),
                label: `Add ${dataset.title}`,
                callback: (html) => {
                    const form = html.querySelector("form");
                    const fd = new FormDataExtended(form);
                    const formData = foundry.utils.expandObject(fd.object);
                    const result = {
                        label: formData.label,
                        maxValue: Number.parseInt(formData.maxValue, 10) || 0,
                    };
                    return result;
                },
                rejectClose: false,
                options: { jQuery: false },
            });

            // if dialog was closed, do nothing
            if (!dlgResult) return null;

            if (array.some((a) => a.label === dlgResult.label)) {
                ui.notifications.warn(
                    `Aim with name "${dlgResult.name} already exists, ignoring`,
                );
                return null;
            }

            array.push(dlgResult);
            array.sort((a, b) => a.maxValue - b.maxValue);
            const updateData = { [dataset.array]: array };
            const result = await this.item.update(updateData);
            if (result) this.render();
            return result;
        }

        async _addArrayItem(event) {
            const dataset = event.currentTarget.dataset;
            await this._onSubmit(event); // Submit any unsaved changes

            let result;
            if (["Number", "String"].includes(dataset.dtype)) {
                result = await this._addPrimitiveSetItem(event);
            } else if (dataset.objectType === "Aim") {
                result = await this._addAimArrayItem(event);
            } else if (dataset.objectType === "ValueDesc") {
                result = await this._valueDescArrayItem(event);
            }
            if (result) this.render();
            return result;
        }

        async _deleteArrayItem(event) {
            const dataset = event.currentTarget.dataset;
            if (!dataset.array) return null;
            await this._onSubmit(event); // Submit any unsaved changes
            let collection = foundry.utils.getProperty(
                this.document,
                dataset.array,
            );
            if (collection instanceof Collection) {
                collection.delete(dataset.value);
            } else {
                collection = collection.filter((a) => a !== dataset.value);
            }
            const result = await this.document.update({
                [dataset.array]: collection,
            });
            if (result) this.render();
            return result;
        }

        async _addObjectKey(event) {
            const dataset = event.currentTarget.dataset;

            await this._onSubmit(event); // Submit any unsaved changes

            let object = foundry.utils.getProperty(
                this.document,
                dataset.object,
            );

            const dialogData = {
                newKey: "",
                newValue: "",
            };

            let dlgTemplate =
                "systems/hm/templates/dialog/keyvalue-dialog.html";
            const html = await renderTemplate(dlgTemplate, dialogData);

            const dlgResult = await Dialog.prompt({
                title: dataset.title,
                content: html.trim(),
                label: `Add ${dataset.title}`,
                callback: (html) => {
                    const form = html.querySelector("form");
                    const fd = new FormDataExtended(form);
                    const formData = foundry.utils.expandObject(fd.object);
                    let formKey = formData.newKey;
                    let formValue = formData.newValue;
                    let value = Number.parseFloat(formValue);
                    if (Number.isNaN(value)) {
                        if (formValue === "true") value = true;
                        else if (formValue === "false") value = false;
                        else if (formValue === "null") value = null;
                        else value = formValue;
                    }
                    return { key: formKey, value: value };
                },
                rejectClose: false,
                options: { jQuery: false },
            });

            // if dialog was closed, or key is empty, do nothing
            if (!dlgResult || !dlgResult.key) return null;

            object[dlgResult.key] = dlgResult.value;
            const updateData = { [dataset.object]: object };
            const result = await this.item.update(updateData);
            if (result) this.render();
            return result;
        }

        /**
         * Asynchronously deletes a key from an object. Retrieves the dataset from the current event, submits any unsaved changes, gets the object using the dataset, deletes the specified key from the object, and updates the list on the server with the modified object.
         *
         * @async
         * @param {*} event
         * @returns {unknown}
         */
        async _deleteObjectKey(event) {
            const dataset = event.currentTarget.dataset;
            await this._onSubmit(event); // Submit any unsaved changes
            // Update the list on the server
            const result = await this.item.update({
                [dataset.object]: {
                    [`-=${dataset.key}`]: null,
                },
            });

            if (result) {
                this.render();
            }
            return result;
        }

        /** @override */
        activateListeners(html) {
            super.activateListeners(html);

            // Everything below here is only needed if the sheet is editable
            if (!this.options.editable) return;

            // Ensure all text is selected when entering text input field
            html.on("click", "input[type='text']", (ev) => {
                if (!ev.currentTarget.dataset?.type) ev.currentTarget.select();
            });

            html.find(".effect-create").click(this._onEffectCreate.bind(this));

            html.find(".effect-toggle").click(this._onEffectToggle.bind(this));

            html.find(".alter-time").click((ev) => {
                const property = ev.currentTarget.dataset.property;
                let time = Number.parseInt(ev.currentTarget.dataset.time, 10);
                if (Number.isNaN(time)) time = 0;
                Utility.onAlterTime(time).then((result) => {
                    if (result !== null) {
                        const updateData = { [property]: result };
                        this.item.update(updateData);
                    }
                });
            });

            // Add/delete Object Key
            html.find(".add-array-item").click(this._addArrayItem.bind(this));
            html.find(".delete-array-item").click(
                this._deleteArrayItem.bind(this),
            );

            // Add/delete Object Key
            html.find(".add-object-key").click(this._addObjectKey.bind(this));
            html.find(".delete-object-key").click(
                this._deleteObjectKey.bind(this),
            );

            // // Active Effect management
            // html.find(".effect-control").click((ev) =>
            //     SohlActiveEffect.onManageActiveEffect(ev, this.document),
            // );

            // html.find(".action-create").click((ev) => {
            //     return Utility.createAction(ev, this.document);
            // });

            // html.find(".action-execute").click((ev) => {
            //     const li = ev.currentTarget.closest(".action-item");
            //     const itemId = li.dataset.itemId;
            //     const action = this.document.system.actions.get(itemId);
            //     action.execute();
            // });

            // html.find(".action-edit").click((ev) => {
            //     const li = ev.currentTarget.closest(".action-item");
            //     const itemId = li.dataset.itemId;
            //     const action = this.document.system.actions.get(itemId);
            //     if (!action) {
            //         throw new Error(
            //             `Action ${itemId} not found on ${this.document.name}.`,
            //         );
            //     }
            //     action.sheet.render(true);
            // });

            // html.find(".action-delete").click((ev) => {
            //     const li = ev.currentTarget.closest(".action-item");
            //     const itemId = li.dataset.itemId;
            //     const action = this.document.system.actions.get(itemId);
            //     if (!action) {
            //         throw new Error(
            //             `Action ${itemId} not found on ${this.document.name}.`,
            //         );
            //     }
            //     return Utility.deleteAction(ev, action);
            // });

            html.find(".default-action").click((ev) => {
                const li = ev.currentTarget.closest(".item");
                const itemId = li.dataset.itemId;
                let item;
                if (this.document instanceof SohlActor) {
                    item = this.actor.getItem(itemId);
                } else {
                    item = this.item.system.items.get(itemId);
                }
                if (item) {
                    const defaultAction = item.system.getDefaultAction(li);
                    if (defaultAction?.callback instanceof Function) {
                        defaultAction.callback();
                    } else {
                        ui.notifications.warn(
                            `${item.label} has no available default action`,
                        );
                    }
                }
            });

            // Activate context menu
            this._contextMenu(html);
        }
    };
}

/**
 * Extend the basic ActorSheet with some common capabilities
 * @extends {ActorSheet}
 */
export class SohlActorSheet extends SohlSheetMixin(ActorSheet) {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["hm", "sheet", "actor"],
            width: 900,
            height: 640,
            filters: [
                {
                    inputSelector: 'input[name="search-traits"]',
                    contentSelector: ".traits",
                },
                {
                    inputSelector: 'input[name="search-skills"]',
                    contentSelector: ".skills",
                },
                {
                    inputSelector: 'input[name="search-bodylocations"]',
                    contentSelector: ".bodylocations",
                },
                {
                    inputSelector: 'input[name="search-fatigue"]',
                    contentSelector: ".fatigues",
                },
                {
                    inputSelector: 'input[name="search-ailments"]',
                    contentSelector: ".ailments",
                },
                {
                    inputSelector: 'input[name="search-stress"]',
                    contentSelector: ".stresses",
                },
                {
                    inputSelector: 'input[name="search-mysteries"]',
                    contentSelector: ".mysteries",
                },
                {
                    inputSelector: 'input[name="search-mysticalabilities"]',
                    contentSelector: ".mysticalabilities",
                },
                {
                    inputSelector: 'input[name="search-gear"]',
                    contentSelector: ".gears",
                },
                {
                    inputSelector: 'input[name="search-effects"]',
                    contentSelector: ".effects-list",
                },
            ],
        });
    }

    /** @inheritdoc */
    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        const closeIndex = buttons.findIndex((btn) => btn.label === "Sheet");
        buttons.splice(closeIndex, 0, {
            label: "Print",
            class: "print-actor",
            icon: "fas fa-print",
            onclick: (ev) => this._onPrintActor(ev),
        });
        return buttons;
    }

    /** @override */
    getData() {
        const data = super.getData();
        data.adata = this.actor.system;
        data.labels = this.actor.labels || {};
        data.itemTypes = this.actor.itemTypes;
        data.itemSubtypes = this.actor.itemSubtypes;
        data.effectStatus = IterWrap.create(
            this.actor.statuses.values(),
        ).reduce((obj, s) => {
            obj[s] = true;
            return obj;
        }, {});
        data.macroTypes = foundry.utils.deepClone(
            game.system.documentTypes.Macro,
        );
        data.dtypes = ["String", "Number", "Boolean"];
        data.attributes = [];
        data.philosophies = [
            {
                name: "No Philosophy",
                domains: [],
            },
        ];
        let cmData = {};
        let wpnData = {};
        let mslData = {};
        IterWrap.create(this.actor.allItems()).forEach((it) => {
            if (it.system instanceof TraitItemData) {
                if (it.system.intensity === "attribute") {
                    data.attributes.push(it);
                } else if (it.system.abbrev === "mov") {
                    data.move = it.system.$score.effective;
                }
            }

            if (it.system instanceof CombatTechniqueStrikeModeItemData) {
                const maneuver = it.nestedIn;

                if (maneuver?.system instanceof CombatManeuverItemData) {
                    cmData[maneuver.name] ||= {
                        item: maneuver,
                        strikeModes: [],
                    };
                    cmData[maneuver.name].strikeModes.push(it);
                }
            }

            if (it.system instanceof MeleeWeaponStrikeModeItemData) {
                const weapon = it.nestedIn;
                if (
                    weapon?.system instanceof WeaponGearItemData &&
                    weapon.system.$isHeldBy?.length >= it.system.minParts
                ) {
                    wpnData[weapon.name] ||= {
                        item: weapon,
                        strikeModes: [],
                    };
                    wpnData[weapon.name].strikeModes.push(it);
                }
            }

            if (it.system instanceof MissileWeaponStrikeModeItemData) {
                const weapon = it.nestedIn;
                if (weapon?.system instanceof WeaponGearItemData) {
                    mslData[weapon.name] ||= {
                        item: weapon,
                        strikeModes: [],
                    };
                    mslData[weapon.name].strikeModes.push(it);
                }
            }

            if (it.system instanceof DomainItemData) {
                const philName =
                    it.system.philosophy?.trim() || "No Philosophy";
                let phil = data.philosophies.find((p) => p.name === philName);
                if (!phil) {
                    phil = {
                        name: philName,
                        domains: [],
                    };
                    data.philosophies.push(phil);
                }

                phil.domains.push(it);
            }
        });
        data.attributes.sort((a, b) => a.sort - b.sort);
        data.philosophies.forEach((p) =>
            p.domains.sort((a, b) => a.sort - b.sort),
        );

        let smKeys = Object.keys(cmData).sort((a, b) => a.localeCompare(b));
        if (smKeys.includes("Unarmed")) {
            smKeys = smKeys.filter((k) => k !== "Unarmed");
            smKeys.unshift("Unarmed");
        }
        data.combatmaneuvers = smKeys.reduce((ary, key) => {
            cmData[key].strikeModes.sort((a, b) => a.sort - b.sort);
            ary.push(cmData[key]);
            return ary;
        }, []);

        smKeys = Object.keys(wpnData).sort((a, b) => a.localeCompare(b));
        data.weapons = smKeys.reduce((ary, key) => {
            wpnData[key].strikeModes.sort((a, b) => a.sort - b.sort);
            ary.push(wpnData[key]);
            return ary;
        }, []);

        smKeys = Object.keys(mslData).sort((a, b) => a.localeCompare(b));
        data.missiles = smKeys.reduce((ary, key) => {
            mslData[key].strikeModes.sort((a, b) => a.sort - b.sort);
            ary.push(mslData[key]);
            return ary;
        }, []);

        data.weightCarried = game.documentTypes.Item.reduce(
            (obj, t) => {
                if (t.endsWith("gear")) {
                    obj[t] = 0;
                }
                return obj;
            },
            { total: 0 },
        );
        IterWrap.create(this.actor.allItems()).forEach((it) => {
            if (it.system instanceof GearItemData) {
                data.weightCarried[it.type] += it.system.totalWeight.effective;
            }
        });

        const topContainer = {
            name: "On Body",
            id: null,
            system: {
                $capacity: this.actor.system.$gearWeight,
                notes: "",
                description: "",
                quantity: 1,
                isCarried: true,
                isEquipped: true,
                qualityBase: 0,
                durabilityBase: 0,
                textReference: "",
                macros: [],
                nestedItems: [],
                maxCapacityBase: 0,
                valueBase: 0,
                weightBase: 0,
                createdTime: 0,
                abbrev: "",
            },
            items: [],
        };
        data.containers = [topContainer];

        this.actor.items.forEach((it) => {
            if (it.system instanceof GearItemData) {
                if (it.system instanceof ContainerGearItemData) {
                    data.containers.push({
                        name: it.name,
                        id: it.id,
                        system: it.system,
                        items: [],
                    });
                }
                topContainer.items.push(it);
            }
        });

        this.actor.system.virtualItems.forEach((it) => {
            if (it.system instanceof GearItemData) {
                const containerId =
                    it.nestedIn?.system instanceof ContainerGearItemData
                        ? it.nestedIn.id
                        : null;

                const container = data.containers.find(
                    (c) => c.id === containerId,
                );
                if (container) {
                    container.items.push(it);
                }
            }
        });

        data.shock = {
            nextRerollDuration: "N/A",
        };

        return data;
    }

    // /**
    //  * A static function that processes changes in an effect. If the effect has no changes or an empty array of changes, it will return 'No Changes'. Otherwise, it will process each change and generate a formatted string based on the change's mode and values. The processed changes are concatenated into a single comma-separated string and returned.
    //  *
    //  * @static
    //  * @param {*} effect
    //  * @returns {*}
    //  */
    // static _aeChanges(effect) {
    //     if (!effect.changes || !effect.changes.length) {
    //         return "No Changes";
    //     }

    //     return effect.changes
    //         .map((ch) => {
    //             const modes = CONST.ACTIVE_EFFECT_MODES;
    //             const key = ch.key;
    //             const val = ch.value;
    //             let prefix = effect.keys[effect.targetType];
    //             if (!prefix) {
    //                 console.warn(
    //                     `SoHL | Effect type "${effect.targetType}" not found`,
    //                 );
    //                 prefix = `NOTYPE[${effect.targetType}]`;
    //             }
    //             if (effect.targetType === "this") {
    //                 if (effect.parent instanceof Item) {
    //                     if (!effect.keys[effect.parent.type]) {
    //                         console.warn(
    //                             `SoHL | Effect type "${effect.parent.type}" not found`,
    //                         );
    //                         prefix = `NOTYPE[${effect.parent.type}]`;
    //                     } else {
    //                         prefix = effect.keys[effect.parent.type]?.[key];
    //                         if (!prefix) {
    //                             console.warn(
    //                                 `SoHL | Effect Key "${key}" not found in type "${effect.parent.type}"`,
    //                             );
    //                             prefix = `BADKEY[${key}]`;
    //                         }
    //                     }
    //                 } else if (effect.parent instanceof Actor) {
    //                     prefix = effect.keys["actor"][key];
    //                     if (!prefix) {
    //                         console.warn(
    //                             `SoHL | Effect Key "${key}" not found in type "actor"`,
    //                         );
    //                         prefix = `BADKEY[${key}]`;
    //                     }
    //                 }
    //             }

    //             switch (ch.mode) {
    //                 case modes.ADD:
    //                     return `${prefix} ${val < 0 ? "-" : "+"} ${Math.abs(
    //                         val,
    //                     )}`;
    //                 case modes.MULTIPLY:
    //                     return `${prefix} ${HM.CONST.CHARS.TIMES} ${val}`;
    //                 case modes.OVERRIDE:
    //                     return `${prefix} = ${val}`;
    //                 case modes.UPGRADE:
    //                     return `${prefix} ${HM.CONST.CHARS.GREATERTHANOREQUAL} ${val}`;
    //                 case modes.DOWNGRADE:
    //                     return `${prefix} ${HM.CONST.CHARS.LESSTHANOREQUAL} ${val}`;
    //                 default:
    //                     return !val ? `${prefix}` : `${prefix} ~ ${val}`;
    //             }
    //         })
    //         .join(", ");
    // }

    async _onPrintActor() {
        // Open new window and dump HTML to it.
        const win = window.open(
            "about:blank",
            "_blank",
            "width=800,height=640,scrollbars=yes,resizable=yes,menubar=no,status=no,toolbar=no",
        );
        if (!win) {
            console.error("Failed to open print window");
            return null;
        }

        win.location.hash = "print";
        win._rootWindow = window;

        const html = await renderTemplate(
            this.template,
            foundry.utils.mergeObject({ printable: true }, this.getData()),
        );
        win.document.write(html);
    }

    // async _onItemDelete(event) {
    //     event.preventDefault();
    //     const header = event.currentTarget;
    //     const li = header.closest(".item");
    //     const itemId = li.dataset.itemId;
    //     const item = this.actor.getItem(itemId);
    //     await item.system.execute("delete");
    // }

    async _onItemCreate(event) {
        if (event.preventDefault) event.preventDefault();
        const header = event.currentTarget;
        // Grab any data associated with this control.
        const dataset = header.dataset;

        const options = { parent: this.actor };
        const data = {
            name: "",
        };
        if (dataset.type) {
            if (dataset.type === "gear") {
                options.types = HM.CONST.GEARTYPES;
                data.type = options.types[0];
            } else if (dataset.type === "body") {
                options.types = [
                    BodyLocationItemData.typeName,
                    BodyPartItemData.typeName,
                    BodyZoneItemData.typeName,
                ];
                data.type = options.types[0];
            } else {
                data.type = dataset.type;
            }
        }
        if (dataset.subType) data["system.subType"] = dataset.subType;
        const item = await SohlItem.createDialog(data, options);
        return item;
    }

    _improveToggleDialog(item) {
        const dlghtml =
            "<p>Do you want to perform a Skill Development Roll (SDR), or just disable the flag?</p>";

        // Create the dialog window
        return new Promise((resolve) => {
            new Dialog({
                title: "Skill Development Toggle",
                content: dlghtml.trim(),
                buttons: {
                    performSDR: {
                        label: "Perform SDR",
                        callback: async () => {
                            return await SohlActor.skillDevRoll(item);
                        },
                    },
                    disableFlag: {
                        label: "Disable Flag",
                        callback: async () => {
                            return item.update({ "system.improveFlag": false });
                        },
                    },
                },
                default: "performSDR",
                close: () => resolve(false),
            }).render(true);
        });
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Add Inventory Item
        html.find(".item-create").click(this._onItemCreate.bind(this));

        // Toggle Active Effects
        html.find(".toggle-status-effect").click((ev) => {
            const statusId = ev.currentTarget.dataset.statusId;
            const effect = this.actor.effects.find((e) =>
                e.statuses.has(statusId),
            );
            if (effect) {
                effect.delete();
            } else {
                let effectData = CONFIG.statusEffects.find(
                    (e) => e.id === statusId,
                );
                const updateData = {
                    img: effectData.img,
                    name: game.i18n.localize(effectData.name),
                    statuses: effectData.id,
                };
                ActiveEffect.create(updateData, { parent: this.actor });
            }
        });

        // Hide all hideable elements
        html.find(".showhide").prop("disabled", false);

        html.find(".toggle-visibility").click((ev) => {
            const filter = ".showhide";
            // (limitToClass ? `.${limitToClass}` : "") + ".showhide";
            const start = ev.currentTarget.closest(".item-list");
            const targets = start.find(filter);
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            targets.prop("disabled", (i, val) => !val);
        });

        // Toggle carry state
        html.find(".item-carry").click((ev) => {
            ev.preventDefault();
            const itemId = ev.currentTarget.closest(".item").dataset.itemId;
            const item = this.actor.getItem(itemId);

            // Only process inventory items, otherwise ignore
            if (item.system instanceof GearItemData) {
                const attr = "system.isCarried";
                return item.update({
                    [attr]: !foundry.utils.getProperty(item, attr),
                });
            }

            return null;
        });

        // Toggle equip state
        html.find(".item-equip").click((ev) => {
            ev.preventDefault();
            const itemId = ev.currentTarget.closest(".item").dataset.itemId;
            const item = this.actor.getItem(itemId);

            // Only process inventory items, otherwise ignore
            if (item.system instanceof GearItemData) {
                const attr = "system.isEquipped";
                return item.update({
                    [attr]: !foundry.utils.getProperty(item, attr),
                });
            }

            return null;
        });

        // Toggle improve flag
        html.find(".toggle-improve-flag").click((ev) => {
            ev.preventDefault();
            const itemId = ev.currentTarget.closest(".item").dataset.itemId;
            const item = this.actor.getItem(itemId);

            // Only process MasteryLevel items
            if (
                item?.system instanceof MasteryLevelItemData &&
                !item.isVirtual
            ) {
                return item.system.toggleImproveFlag();
            }
            return null;
        });
    }
}

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class SohlItemSheet extends SohlSheetMixin(ItemSheet) {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["hm", "sheet", "item"],
            width: 560,
            height: 550,
        });
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const data = super.getData();

        // Re-define the template data references (backwards compatible)
        data.item = this.item;
        data.idata = this.item.system;
        data.itemType = this.item.type;
        data.hasActor = !!this.actor;

        data.hasTraitChoices =
            this.item.system instanceof TraitItemData &&
            Object.keys(this.item.system.choices).length;

        // If this is a container, then separate the nested items into two lists,
        // one for gear and the other for all other items.  If it is not a container,
        // then all nested items simply go into the items list.
        data.items = [];
        data.gear = [];

        data.inContainer = null;
        if (
            this.item.system instanceof GearItemData &&
            this.item.nestedIn instanceof ContainerGearItemData
        ) {
            data.inContainer = this.item.nestedIn;
        }

        if (this.item.system instanceof ContainerGearItemData) {
            const topContainer = {
                name: this.item.name,
                id: this.item.id,
                system: this.item.system,
                items: [],
            };
            data.containers = [topContainer];

            this.item.system.items.forEach((it) => {
                if (it.system instanceof ContainerGearItemData) {
                    data.containers.push({
                        name: it.name,
                        id: it.id,
                        system: it.system,
                        items: [],
                    });
                }
            });

            data.containers.forEach((c) => {
                c.system.items.forEach((ci) => {
                    if (ci.system instanceof GearItemData) {
                        c.items.push(ci);
                    }
                });
            });
        }

        data.traitChoices = this.item.system.choices; // this will only be defined for Traits, otherwise undefined
        data.bodyLocationChoices = {};

        if (this.item.actor) {
            data.holdableItems = { "": "Nothing" };
            data.combatSkills = {
                melee: { "": "None" },
                missile: { "": "None" },
                maneuver: { "": "None" },
            };

            // Generate a list of domains specific to this item
            data.domains = Object.entries(
                this.item.actor.system.$domains,
            ).reduce((obj, [cat, coll]) => {
                const tmpAry = IterWrap.create(coll.entries()).map(
                    ([abbrev, domain]) => [abbrev, domain.name],
                );

                // If the current item's domain is not in the loaded set of domains, then temporarily
                // add it (so that it doesn't get reset from the current value)
                if (
                    !tmpAry.some(
                        ([abbrev]) => abbrev === this.item.system.domain,
                    )
                )
                    tmpAry.push([
                        this.item.system.domain,
                        `Unknown (${this.item.system.domain})`,
                    ]);

                tmpAry.sort((a, b) => a[1].localeCompare(b[1])),
                    (obj[cat] = Object.fromEntries(tmpAry));
                return obj;
            }, {});

            IterWrap.create(this.item.actor.allItems()).forEach((it) => {
                // Fill appropriate lists for individual item sheets
                if (it.system instanceof BodyLocationItemData) {
                    data.bodyLocationChoices[it.name] = it.name;
                }

                if (it.system instanceof BodyZoneItemData) {
                    if (!data.zoneNames) {
                        data.zoneNames = [it.name];
                    } else {
                        if (!data.zoneNames.includes(it.name)) {
                            data.zoneNames.push(it.name);
                        }
                    }
                }

                if (it.system instanceof AnatomyItemData) {
                    data.weaponLimbs = it.system.weaponLimbs;
                }

                if (it.system instanceof SkillItemData) {
                    if (it.system.weaponGroup === "melee") {
                        data.combatSkills.melee[it.system.name] =
                            it.system.name;
                    }

                    if (it.system.weaponGroup === "missile") {
                        data.combatSkills.missile[it.system.name] =
                            it.system.name;
                    }

                    if (["maneuver", "melee"].includes(it.system.weaponGroup)) {
                        data.combatSkills.maneuver[it.system.name] =
                            it.system.name;
                    }
                }

                if (
                    !it.isNested &&
                    it.system instanceof GearItemData &&
                    !(it.system instanceof ArmorGearItemData)
                ) {
                    data.holdableItems[it.id] = it.name;
                }

                if (this.item.system instanceof WeaponGearItemData) {
                    if (it.system instanceof SkillItemData) {
                        if (
                            ["melee", "missle"].includes(it.system.weaponGroup)
                        ) {
                            data.combatSkills[it.system.weaponGroup][it.name] =
                                it.name;
                        } else if (it.system.weaponGroup === "meleemissile") {
                            data.combatSkills.melee[it.name] = it.name;
                            data.combatSkills.missle[it.name] = it.name;
                        }
                    }
                }
            });
        }
        if (!Object.keys(data.bodyLocationChoices).length) {
            data.bodyLocationChoices[""] = "None";
        }

        return data;
    }

    /** @override */
    setPosition(options = {}) {
        const position = super.setPosition(options);
        const sheetBody = this.element.find(".sheet-body");
        const bodyHeight = position.height - 192;
        sheetBody.css("height", bodyHeight);
        return position;
    }

    get isEditable() {
        return this.item.isVirtual ? false : super.isEditable;
    }

    /** @inheritdoc */
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    _canDragStart(selector) {
        return this.isEditable;
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    _canDragDrop(selector) {
        return this.isEditable;
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    _onDragStart(event) {
        const li = event.currentTarget;
        if ("link" in event.target.dataset) return;

        // Create drag data
        let dragData;

        // Embed Items
        if (li.dataset.itemId) {
            const item = this.item.getNestedItemById(li.dataset.itemId);
            dragData = item.toDragData();
        }

        // Active Effect
        if (li.dataset.effectId) {
            const effect = this.item.effects.get(li.dataset.effectId);
            dragData = effect.toDragData();
        }

        // Macros
        if (li.dataset.macroId) {
            const macro = this.item.system.macros.find(
                (m) => m._id === li.dataset.macroId,
            );
            dragData = foundry.utils.deepClone(macro);
        }

        if (!dragData) return;

        // Set data transfer
        event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    }

    async _onSortItem(event) {
        return this.item._onSortItem(event);
    }

    /** @inheritdoc */
    async _onDrop(event) {
        const data = TextEditor.getDragEventData(event);
        const allowed = Hooks.call("dropItemSheetData", this.item, this, data);
        if (allowed === false) return;

        if (data.type === "ActiveEffect") {
            return this._onDropActiveEffect(event, data);
        } else if (data.type === "Item") {
            return this._onDropItem(event, data);
        } else if (data.type === "Macro") {
            return this._onDropMacro(event, data);
        }
    }

    async _onDropMacro(event, data) {
        if (!this.item.isOwner) return false;

        const droppedMacro = await SohlMacro.fromDropData(data);
        if (droppedMacro) {
            if (
                this.item.system.macros.some((m) => m._id === droppedMacro.id)
            ) {
                // dropped macro is already in this item,
                // so we just sort it.
                return this._onSortMacro(event, droppedMacro.toObject());
            } else {
                // Item is not currently in the list of items for the item,
                // so add it.
                return await SohlMacro.create(droppedMacro.toObject(), {
                    clean: true,
                    nestedIn: this.item,
                });
            }
        }

        // We can't deal with the dropped macro, so fail
        return false;
    }

    _onSortMacro(event, macroData) {
        // Get the drag source and drop target
        const macros = this.item.system.macros;
        const source = macros.find((m) => m._id === macroData._id);
        const dropTarget = event.target.closest("[data-macro-id]");
        if (!dropTarget) return;
        const target = macros.get(dropTarget.dataset.macroId);

        // Don't sort on yourself
        if (source.id === target.id) return;

        // Identify sibling items based on adjacent HTML elements
        const siblings = [];
        for (let el of dropTarget.parentElement.children) {
            const siblingId = el.dataset.macroId;
            if (siblingId && siblingId !== source.id)
                siblings.push(macros.find((m) => m._id === el.dataset.macroId));
        }

        // Perform the sort
        const sortUpdates = SortingHelpers.performIntegerSort(source, {
            target,
            siblings,
        });

        const updateData = {
            "system.macros": foundry.utils.deepClone(this.item.system.macros),
        };

        sortUpdates.forEach((u) => {
            const target = updateData["system.macros"].find(
                (m) => m._id === u.target._id,
            );
            if (target) target.sort = u.update.sort;
        });

        // Perform the update
        return this.item.update(updateData);
    }

    async _createNestedItem(event) {
        await this._onSubmit(event); // Submit any unsaved changes
        const dataset = event.currentTarget.dataset;
        const options = { nestedIn: this.item, parent: this.item.actor };
        const data = { name: "" };
        if (dataset.type === "gear") {
            options.types = HM.CONST.GEARTYPES;
            data.type = options.types[0];
        } else if (dataset.type) {
            data.type = dataset.type;
        }
        options.items =
            IterWrap.create(this.item.actor?.allItems()).filter(
                (it) => it.type === dataset.type,
            ) || [];
        options.items.sort((a, b) => a.sort - b.sort);
        if (dataset.subType) data["system.subType"] = dataset.subType;
        const item = await SohlItem.createDialog(data, options);
        if (item) this.render();
        return item;
    }

    async _deleteNestedItem(event) {
        event.preventDefault();
        const li = event.currentTarget.closest(".item");
        const nestedItemId = li.dataset.itemId;
        if (nestedItemId) {
            const nestedItem = this.item.getNestedItemById(nestedItemId);
            if (!nestedItem) {
                console.error(
                    `SoHL | Delete aborted, nested item ${nestedItemId} in item ${this.item.name} was not found.`,
                );
                return;
            }

            await Dialog.confirm({
                title: `Delete Nested Item: ${nestedItem.label}`,
                content:
                    "<p>Are You Sure?</p><p>This item will be deleted and cannot be recovered.</p>",
                yes: () => {
                    nestedItem.delete();
                    this.render();
                },
            });
        }
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        html.on("keypress", ".properties", (ev) => {
            var keycode = ev.keyCode ? ev.keyCode : ev.which;
            if (keycode == "13") {
                super.close();
            }
        });

        // Create/edit/delete Embedded Item
        html.find(".nested-item-create").click(
            this._createNestedItem.bind(this),
        );

        html.find(".nested-item-edit").click((ev) => {
            const li = ev.currentTarget.closest(".item");
            const itemId = li.dataset.itemId;
            const nestedItem = this.item.getNestedItemById(itemId);
            nestedItem.sheet.render(true);
        });

        html.find(".nested-item-delete").click(
            this._deleteNestedItem.bind(this),
        );
    }
}

export class SohlContainerGearItemSheet extends SohlItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 725,
        });
    }
}

export class NestedItemSheet extends ItemSheet {
    /**
     * Updates an object with new data.
     * @param event The event triggering the update
     * @param formData The new data to update the object with
     * @returns A Promise that resolves to the updated object after the update operation is complete
     *
     * @async
     * @param {*} event
     * @param {*} formData
     * @returns {unknown}
     */

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    async _updateObject(event, formData) {
        const newAry = foundry.utils.deepClone(this.item.system.items);
        const index = newAry.findIndex((obj) => obj._id === formData._id);
        if (index < 0) {
            newAry.push(formData);
        } else {
            foundry.utils.mergeObject(newAry[index], formData);
            newAry.splice(index, 1, formData);
        }

        return this.item.update({ "system.items": newAry });
    }
}

/**
 * A class containing static methods for handling commands related to combat fatigue and chat card actions. Includes methods to handle combat fatigue, display chat action buttons, and handle chat card actions.
 *
 * @export
 * @class Commands
 * @typedef {Commands}
 */
export class Commands {
    static async createItemFromJson(filepath) {
        const descObj = await Utility.loadJSONFromFile(filepath);

        const createData = foundry.utils.deepClone(descObj.template);
        createData._id ||= foundry.utils.randomID();

        if (descObj.nestedItems) {
            foundry.utils.mergeObject(createData, {
                system: {
                    nestedItems: [],
                },
            });

            for (let [name, type] of descObj.nestedItems) {
                const itemData = await Utility.getItemFromPacks(
                    name,
                    HM.sysVer.CONFIG.Item.compendiums,
                    { itemType: type },
                );
                if (itemData) {
                    itemData._id = foundry.utils.randomID();
                    delete itemData.folder;
                    delete itemData.sort;
                    delete itemData._stats;
                    delete itemData.pack;
                    createData.system.nestedItems.push(itemData);
                }
            }
        }
        const result = await SohlItem.create(createData, { clean: true });
        console.log(`Item with name ${descObj.name} created`);
        return result;
    }

    /**
     * Handles combat fatigue for each combatant in a combat. Calculates the distance a combatant has moved since the start of combat and applies combat fatigue to the combatant's actor. Updates flags to mark that the combatant has not participated in combat and sets the start location for the next combat round.
     *
     * @static
     * @param {*} combat
     */
    static handleCombatFatigue(combat) {
        combat.turns.forEach((combatant) => {
            const actor = combatant.token.actor;
            const didCombat = combatant.getFlag("hm", "didCombat");

            if (didCombat) {
                // Calculate distance combatant has moved
                const startLocation = combatant.getFlag("hm", "startLocation");
                const dist = startLocation
                    ? combat.getDistance(startLocation, combatant.token.center)
                    : 0;

                actor?.system.applyCombatFatigue(dist);
            }

            combatant.update({
                "flags.hm.didCombat": false,
                "flags.hm.startLocation": combatant.token.center,
            });
        });
    }

    /**
     * Optionally hide the display of chat card action buttons which cannot be performed by the user
     */

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    static displayChatActionButtons(message, html, data) {
        const chatCard = html.find(".chat-card");
        if (chatCard.length > 0) {
            // If the user is the GM, proceed
            if (game.user.isGM) return;

            // Otherwise conceal action buttons
            const buttons = chatCard.find("button[data-action]");
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            buttons.each((i, btn) => {
                if (btn.dataset?.handlerActorUuid) {
                    let actor = fromUuidSync(btn.dataset.handlerActorUuid);
                    if (!actor || !actor.isOwner) {
                        btn.style.display = "none";
                    }
                }
            });
        }
    }

    static async onChatCardAction(event) {
        event.preventDefault();
        const button = event.currentTarget;
        button.disabled = true;
        const options = IterWrap.create(button.dataset?.entries()).reduce(
            (obj, [key, val]) => {
                if (key.endsWith("Json")) {
                    const newKey = key.slice(0, -4);
                    obj[newKey] = JSON.parse(val);
                } else {
                    obj[key] = val;
                }
                return obj;
            },
            {},
        );
        let doc = await fromUuid(options.targetUuid);
        if (doc instanceof Token) {
            options.token = doc.document;
            options.actor = doc.actor;
            doc = options.actor;
        } else if (doc instanceof TokenDocument) {
            options.token = doc;
            options.actor = doc.actor;
            doc = options.actor;
        } else if (doc instanceof SohlActor) {
            options.token = doc.getToken();
            options.actor = doc;
        } else if (doc instanceof SohlItem) {
            options.actor = doc.actor;
            options.token = doc.actor.getToken();
        } else {
            throw new Error(
                `targetUuid ${options.targetUuid} is not a Token, TokenDocument, Actor, or Item UUID`,
            );
        }

        doc.system.execute(options.action, ...options);
        button.disabled = false;
    }
}
HM.cmds = Commands;

export const SohlActorDataModels = {
    [AnimateEntityActorData.typeName]: AnimateEntityActorData,
    [InanimateObjectActorData.typeName]: InanimateObjectActorData,
};

export const SohlActorTypeLabels = {
    [AnimateEntityActorData.typeName]:
        AnimateEntityActorData.typeLabel.singular,
    [InanimateObjectActorData.typeName]:
        InanimateObjectActorData.typeLabel.singular,
};

export const SohlActorTypeIcons = {
    [AnimateEntityActorData.typeName]: "fas fa-person",
    [InanimateObjectActorData.typeName]: "fas fa-treasure-chest",
};

export const SohlItemDataModels = {
    [AffiliationItemData.typeName]: AffiliationItemData,
    [AfflictionItemData.typeName]: AffiliationItemData,
    [AnatomyItemData.typeName]: AnatomyItemData,
    [ArmorGearItemData.typeName]: ArmorGearItemData,
    [BodyLocationItemData.typeName]: BodyLocationItemData,
    [BodyPartItemData.typeName]: BodyPartItemData,
    [BodyZoneItemData.typeName]: BodyZoneItemData,
    [CombatTechniqueStrikeModeItemData.typeName]:
        CombatTechniqueStrikeModeItemData,
    [CombatManeuverItemData.typeName]: CombatManeuverItemData,
    [ConcoctionGearItemData.typeName]: ConcoctionGearItemData,
    [ContainerGearItemData.typeName]: ContainerGearItemData,
    [EventItemData.typeName]: EventItemData,
    [InjuryItemData.typeName]: InjuryItemData,
    [MeleeWeaponStrikeModeItemData.typeName]: MeleeWeaponStrikeModeItemData,
    [MiscGearItemData.typeName]: MiscGearItemData,
    [MissileWeaponStrikeModeItemData.typeName]: MissileWeaponStrikeModeItemData,
    [MysteryItemData.typeName]: MysteryItemData,
    [MysticalAbilityItemData.typeName]: MysticalAbilityItemData,
    [DomainItemData.typeName]: DomainItemData,
    [MysticalDeviceItemData.typeName]: MysticalDeviceItemData,
    [ProjectileGearItemData.typeName]: ProjectileGearItemData,
    [SkillItemData.typeName]: SkillItemData,
    [TraitItemData.typeName]: TraitItemData,
    [WeaponGearItemData.typeName]: WeaponGearItemData,
};

export const SohlItemTypeIcons = {
    [AffiliationItemData.typeName]: "fa-duotone fa-people-group",
    [AfflictionItemData.typeName]: "fas fa-face-nauseated",
    [AnatomyItemData.typeName]: "fas fa-person",
    [ArmorGearItemData.typeName]: "fas fa-shield-halved",
    [BodyLocationItemData.typeName]: "fa-solid fa-hand",
    [BodyPartItemData.typeName]: "fa-duotone fa-skeleton-ribs",
    [BodyZoneItemData.typeName]: "fa-duotone fa-person",
    [CombatTechniqueStrikeModeItemData.typeName]: "fas fa-hand-fist",
    [CombatManeuverItemData.typeName]: "fas fa-hand-fist",
    [ConcoctionGearItemData.typeName]: "fas fa-flask-round-potion",
    [ContainerGearItemData.typeName]: "fas fa-sack",
    [EventItemData.typeName]: "fas fa-gear",
    [InjuryItemData.typeName]: "fas fa-user-injured",
    [MeleeWeaponStrikeModeItemData.typeName]: "fas fa-sword",
    [MiscGearItemData.typeName]: "fas fa-ball-pile",
    [MissileWeaponStrikeModeItemData.typeName]: "fas fa-bow-arrow",
    [MysteryItemData.typeName]: "fas fa-sparkles",
    [MysticalAbilityItemData.typeName]: "fas fa-hand-sparkles",
    [DomainItemData.typeName]: "fas fa-sparkle",
    [MysticalDeviceItemData.typeName]: "fas fa-wand-sparkles",
    [ProjectileGearItemData.typeName]: "fas fa-bow-arrow",
    [SkillItemData.typeName]: "fas fa-head-side-gear",
    [TraitItemData.typeName]: "fas fa-user-gear",
    [WeaponGearItemData.typeName]: "fas fa-sword",
};

export const SohlModifiers = {
    MasteryLevelModifier: MasteryLevelModifier,
    ImpactModifier: ImpactModifier,
    ValueModifier: ValueModifier,
    CombatModifier: CombatModifier,
};

export const SohlItemTypeLabels = {
    [AffiliationItemData.typeName]: AffiliationItemData.typeLabel.singular,
    [AfflictionItemData.typeName]: AfflictionItemData.typeLabel.singular,
    [AnatomyItemData.typeName]: AnatomyItemData.typeLabel.singular,
    [ArmorGearItemData.typeName]: ArmorGearItemData.typeLabel.singular,
    [BodyLocationItemData.typeName]: BodyLocationItemData.typeLabel.singular,
    [BodyPartItemData.typeName]: BodyPartItemData.typeLabel.singular,
    [BodyZoneItemData.typeName]: BodyZoneItemData.typeLabel.singular,
    [CombatTechniqueStrikeModeItemData.typeName]:
        CombatTechniqueStrikeModeItemData.typeLabel.singular,
    [CombatManeuverItemData.typeName]:
        CombatManeuverItemData.typeLabel.singular,
    [ConcoctionGearItemData.typeName]:
        ConcoctionGearItemData.typeLabel.singular,
    [ContainerGearItemData.typeName]: ContainerGearItemData.typeLabel.singular,
    [EventItemData.typeName]: EventItemData.typeLabel.singular,
    [InjuryItemData.typeName]: InjuryItemData.typeLabel.singular,
    [MeleeWeaponStrikeModeItemData.typeName]:
        MeleeWeaponStrikeModeItemData.typeLabel.singular,
    [MiscGearItemData.typeName]: MiscGearItemData.typeLabel.singular,
    [MissileWeaponStrikeModeItemData.typeName]:
        MissileWeaponStrikeModeItemData.typeLabel.singular,
    [MysteryItemData.typeName]: MysteryItemData.typeLabel.singular,
    [MysticalAbilityItemData.typeName]:
        MysticalAbilityItemData.typeLabel.singular,
    [DomainItemData.typeName]: DomainItemData.typeLabel.singular,
    [MysticalDeviceItemData.typeName]:
        MysticalDeviceItemData.typeLabel.singular,
    [ProjectileGearItemData.typeName]:
        ProjectileGearItemData.typeLabel.singular,
    [SkillItemData.typeName]: SkillItemData.typeLabel.singular,
    [TraitItemData.typeName]: TraitItemData.typeLabel.singular,
    [WeaponGearItemData.typeName]: WeaponGearItemData.typeLabel.singular,
};

HM.class = {
    SohlActor,
    SohlItem,
    SohlMacro,
    SohlMacroConfig,
    SohlActiveEffect,
    SohlActiveEffectConfig,
    SkillBase,
    Utility,
    SohlActorSheet,
    SohlItemSheet,
    NestedItemSheet,
    Commands,
};

HM.CONST.GEARTYPES = [
    MiscGearItemData.typeName,
    ContainerGearItemData.typeName,
    ArmorGearItemData.typeName,
    WeaponGearItemData.typeName,
    ProjectileGearItemData.typeName,
    ConcoctionGearItemData.typeName,
];
