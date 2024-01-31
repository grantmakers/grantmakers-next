export const firstLetter = (organization_name: string) => {
  if (organization_name.startsWith('The ')) {
    return organization_name.split(' ')[1][0];
  } else {
    return organization_name[0];
  }
};

export const upperFirstLetter = (name: string) => firstLetter(name).toUpperCase();
