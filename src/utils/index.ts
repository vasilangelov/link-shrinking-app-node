type EnumLike = Record<string, string | number>;

const ENUM_MEMO = new Map<EnumLike, Set<string | number>>();

export function isValidEnumValue<Enum extends EnumLike>(
  enumObject: Enum,
  value: unknown
): value is Enum[keyof Enum] {
  if (typeof value !== "string" && typeof value !== "number") {
    return false;
  }

  let valueSet = ENUM_MEMO.get(enumObject);

  if (!valueSet) {
    valueSet = new Set(Object.values(enumObject));

    ENUM_MEMO.set(enumObject, valueSet);
  }

  return valueSet.has(value);
}
