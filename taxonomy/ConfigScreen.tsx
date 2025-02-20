import React, { useState } from 'react';
import { connect, RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Button, Canvas, Form, FieldGroup, TextField } from 'datocms-react-ui';

type ConfigScreenProps = {
  ctx: RenderConfigScreenCtx;
};

const ConfigScreen: React.FC<ConfigScreenProps> = ({ ctx }) => {
  const [apiToken, setApiToken] = useState<string>(
    (ctx.plugin.attributes.parameters.apiToken as string) || ''
  );

  const handleSave = async () => {
    await ctx.updatePluginParameters({ apiToken });
    ctx.notice('Settings saved successfully!');
  };

  return (
    <Canvas ctx={ctx}>
      <Form>
        <FieldGroup>
          <TextField
            id="apiToken"
            name="apiToken"
            label="DatoCMS API Token"
            hint="Enter your API token to fetch the taxonomy tree."
            required
            value={apiToken}
            onChange={(value) => setApiToken(value as string)} // Ensure proper typing
          />
        </FieldGroup>
        <Button type="button" onClick={handleSave}>
          Save
        </Button>
      </Form>
    </Canvas>
  );
};

export default ConfigScreen;
