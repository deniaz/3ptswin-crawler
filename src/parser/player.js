// @flow
import cheerio from 'cheerio';

export const parsePlayerLinks = null;

export const parsePlayerData = (body: string) => {
  const $ = cheerio.load(body);
  const player = {
    id: $('.large-8 .table-footer a').attr('id'),
    number: $('.dataRN').text().replace('#', ''),
    name: $('h1[itemprop="name"]').text().trim(),
    last_name: $('h1[itemprop="name"] b').text().trim(),
    first_name: $('h1[itemprop="name"]').text().replace($('h1[itemprop="name"] b').text(), '').trim(),
    position: $('.dataContent .dataBottom .dataDaten:nth-of-type(2) p:nth-of-type(2) .dataValue').text().trim(),
    // birthday: $('table.auflistung tbody tr:nth-of-type(8) td').text().trim(),
    height: $('.dataContent .dataBottom .dataDaten:nth-of-type(2) p:nth-of-type(1) .dataValue').text().trim(),
    // foot: $('table.auflistung tbody tr:nth-of-type(8) td').text().trim()
  };

  return {
    type: 'player',
    data: {
      player,
    }
  };
};

// export const parsePlayerLinks = () => null;
