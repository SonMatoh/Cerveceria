// MOLÉCULA: Lista de textos (uniones de átomos Text).
// Recibe un array de ítems { variant, className, text }.

import Text from '../atoms/Text.jsx';

export function Texts({ items = [] }) {
  return (
    <>
      {items.map((item, index) => (
        <Text key={index} variant={item.variant} className={item.className}>
          {item.text}
        </Text>
      ))}
    </>
  );
}

export default Texts;
