import { imagePath } from './college'

export const libraryPhotos = [
  { file: 'cpu-library-2025.jpg', title: 'Henry Luce III Library at CPU, 2025', author: 'Johngaje92', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Henry_Luce_III_Library_-_Central_Philippine_University.jpg' },
  { file: 'cpu-library-courtyard.jpg', title: 'Henry Luce III Library and courtyard at CPU', author: 'Johngaje92', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Henry_Luce_III_Library_at_Central_Philippine_University.jpg' },
  { file: 'cpu-library-2018.jpg', title: 'Henry Luce III Library at CPU, 2018', author: 'Americana22ount', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Henry_Luce_III_Library.jpg' },
  { file: 'cpu-library-2013.jpg', title: 'Henry Luce III Library at CPU, 2013', author: 'Ryn910', license: 'CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:CPU_Library_Henry_Luce_III_Library.JPG' },
].map(photo => ({ ...photo, image: imagePath(photo.file) }))
