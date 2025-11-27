import React, { useRef, useEffect } from "react";
import { useField } from "formik";
import { t } from "ttag";

import { TextInput, Button, Group, Stack, Text } from "metabase/ui";

interface Props {
  userId?: number | null;
}

const FormLoginAttributes: React.FC<Props> = () => {
  const [field, meta, helpers] = useField("login_attributes");
  const valueInputRef = useRef<HTMLInputElement>(null);
  const [focusKey, setFocusKey] = React.useState<string | null>(null);

  const attributes: Record<string, string> = (field.value && typeof field.value === "object" ? field.value : {}) as Record<string, string>;

  const handleAddPair = () => {
    const newKey = "db_role";
    helpers.setValue({
      ...attributes,
      [newKey]: "",
    });
    // Focus on the value input after render
    setFocusKey(newKey);
  };

  useEffect(() => {
    if (focusKey && valueInputRef.current) {
      valueInputRef.current.focus();
      setFocusKey(null);
    }
  }, [focusKey, attributes]);

  const handleUpdateKey = (oldKey: string, newKey: string) => {
    if (oldKey === newKey || !newKey.trim()) {
      return;
    }
    const updated = { ...attributes };
    const value = updated[oldKey];
    delete updated[oldKey];
    updated[newKey.trim()] = value;
    helpers.setValue(updated);
  };

  const handleUpdateValue = (key: string, newValue: string) => {
    helpers.setValue({
      ...attributes,
      [key]: newValue,
    });
  };

  const handleRemovePair = (key: string) => {
    const updated = { ...attributes };
    delete updated[key];
    helpers.setValue(updated);
  };

  const entries = Object.entries(attributes);

  return (
    <Stack>
      <Text size="sm" fw={500}>{t`Login Attributes`}</Text>
      <Text size="xs" c="dimmed">{t`Add key-value pairs to pass to the data warehouse for authentication`}</Text>
      
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

      <Button
        variant="light"
        size="sm"
        onClick={handleAddPair}
      >
        {t`Add attribute`}
      </Button>
    </Stack>
  );
};

export default FormLoginAttributes;
