// @flow
import cheerio from 'cheerio';

export const parseClubs = (body: string): Object => {
    const $ = cheerio.load(body);
    const competition = {
        competition: {
            id: $('#wettbewerb_select_breadcrumb').val(),
            name: $('.spielername-profil').text().trim(),
            season: $('[name="saison_id"]').val()
        },
        clubs: []
    };

    $('#main > .row > .large-8.columns > .box .responsive-table table tbody tr').each((i, el) => {
      const $tr = $(el);
      const $anchor = $tr.find('.hauptlink.hide-for-small a.vereinprofil_tooltip');

      competition.clubs.push({
          id: $anchor.attr('id'),
          name: $anchor.text(),
      });
    });

    return competition;
};

export const parseTableLinks = (body: string): string[] => {
    return [];
};
