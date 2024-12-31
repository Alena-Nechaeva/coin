import { Roboto, Ubuntu, Work_Sans } from 'next/font/google'

export const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal'],
  subsets: ['cyrillic'],
  display: 'swap',
});

export const workSans = Work_Sans({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

export const ubuntu = Ubuntu({
  weight: ['300', '400', '500', '700'],
  style: ['normal'],
  subsets: ['cyrillic'],
  display: 'swap',
});