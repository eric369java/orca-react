import { Drawer, FocusTrap, } from '@mantine/core';

type PanelProps = { 
  content : React.ReactNode,
  position : 'left' | 'right',
  opened : boolean,
  close : () => void,
}

export function Panel({content, position, opened, close} : PanelProps) {
  return (
    <Drawer opened={opened} position={position} onClose={close} withCloseButton={false} offset={8} radius='md'>
      <FocusTrap.InitialFocus />
      {content}
    </Drawer>
  );
}