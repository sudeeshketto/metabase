import { useField } from "formik";
import { useEffect, useRef, useState } from "react";
import { t } from "ttag";

import { Button, Group, Stack, Text, TextInput } from "metabase/ui";
import type { UserId } from "metabase-types/api";

interface Props {
  userId?: UserId | null;
}

const getAttributes = (value: unknown) => {
  return value && typeof value === "object"
    ? (value as Record<string, string>)
    : {};
};

const FormLoginAttributes = (_props: Props) => {
  const [{ value }, , { setValue }] = useField("login_attributes");
  const valueInputRef = useRef<HTMLInputElement>(null);
  const [focusKey, setFocusKey] = useState<string | null>(null);

  const attributes = getAttributes(value);

  const handleAddPair = () => {
    const newKey = "db_role";
    setValue({
      ...attributes,
      [newKey]: attributes[newKey] ?? "",
    });
    setFocusKey(newKey);
  };

  useEffect(() => {
    if (focusKey && valueInputRef.current) {
      valueInputRef.current.focus();
      setFocusKey(null);
    }
  }, [focusKey]);

  const handleUpdateKey = (oldKey: string, newKey: string) => {
    if (oldKey === newKey || !newKey.trim()) {
      return;
    }
    const updated = { ...attributes };
    const value = updated[oldKey];
    delete updated[oldKey];
    updated[newKey.trim()] = value;
    setValue(updated);
  };

  const handleUpdateValue = (key: string, newValue: string) => {
    setValue({
      ...attributes,
      [key]: newValue,
    });
  };

  const handleRemovePair = (key: string) => {
    const updated = { ...attributes };
    delete updated[key];
    setValue(updated);
  };

  const entries = Object.entries(attributes);

  return (
    <Stack>
      <Text size="sm" fw={500}>
        {t`Login Attributes`}
      </Text>
      <Text size="xs" c="dimmed">
        {t`Add key-value pairs to pass to the data warehouse for authentication`}
      </Text>

      {entries.length > 0 && (
        <Stack gap="xs">
          {entries.map(([key, value]) => (
            <Group key={key} gap="xs" align="flex-end">
              <TextInput
                placeholder={t`Key`}
                value={key}
                onChange={(e) => handleUpdateKey(key, e.currentTarget.value)}
                style={{ flex: 1 }}
                size="sm"
              />
              <TextInput
                ref={focusKey === key ? valueInputRef : null}
                placeholder={t`Value`}
                value={value}
                onChange={(e) => handleUpdateValue(key, e.currentTarget.value)}
                style={{ flex: 1 }}
                size="sm"
              />
              <Button
                variant="default"
                size="xs"
                onClick={() => handleRemovePair(key)}
              >
                {t`Remove`}
              </Button>
            </Group>
          ))}
        </Stack>
      )}

      <Button variant="light" size="sm" onClick={handleAddPair}>
        {t`Add attribute`}
      </Button>
    </Stack>
  );
};

export default FormLoginAttributes;
