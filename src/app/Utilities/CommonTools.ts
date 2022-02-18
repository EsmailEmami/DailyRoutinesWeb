import {ActivatedRoute, Params, Router} from "@angular/router";

export class CommonTools {

  public static getCurrentUrlWithoutParams(router: Router): string {
    let urlTree = router.parseUrl(router.url);

    urlTree.queryParams = {};
    urlTree.fragment = null; // optional

    return decodeURIComponent(urlTree.toString());
  }

  public static GetUrlParams(activatedRoute: ActivatedRoute): Params {

    // @ts-ignore
    let paramsData: Params = null;

    activatedRoute.queryParams.subscribe(params => {
      paramsData = params
    });

    return paramsData;
  }

  public static GetMonths(year: number, defaultText?: string): { name: string, value: string }[] {

    if (year <= 0) {
      return [
        {
          name: 'لطفا سال را انتخاب کنید',
          value: '0'
        }]
    }

    return [
      {
        name: defaultText ? defaultText : 'لطفا ماه را انتخاب کنید',
        value: '0'
      },
      {
        name: 'فروردین',
        value: '1'
      },
      {
        name: 'اردیبهشت',
        value: '2'
      },
      {
        name: 'خرداد',
        value: '3'
      }, {
        name: 'تیر',
        value: '4'
      },
      {
        name: 'مرداد',
        value: '5'
      },
      {
        name: 'شهریور',
        value: '6'
      },
      {
        name: 'مهر',
        value: '7'
      },
      {
        name: 'آبان',
        value: '8'
      },
      {
        name: 'آذر',
        value: '9'
      },
      {
        name: 'دی',
        value: '10'
      },
      {
        name: 'بهمن',
        value: '11'
      },
      {
        name: 'اسفند',
        value: '12'
      },
    ]
  }

  public static GetMonthDays(month: number, defaultText?: string): { name: string, value: number }[] {

    if (month <= 0) {
      return [{
        name: 'لطفا ماه را انتخاب کنید',
        value: 0
      }]
    }

    let value: { name: string, value: number }[] = [
      {
        name: defaultText ? defaultText : 'لطفا روز را انتخاب کنید',
        value: 0
      },
      {name: '1', value: 1},
      {name: '2', value: 2},
      {name: '3', value: 3},
      {name: '4', value: 4},
      {name: '5', value: 5},
      {name: '6', value: 6},
      {name: '7', value: 7},
      {name: '8', value: 8},
      {name: '9', value: 9},
      {name: '10', value: 10},
      {name: '11', value: 11},
      {name: '12', value: 12},
      {name: '13', value: 13},
      {name: '14', value: 14},
      {name: '15', value: 15},
      {name: '16', value: 16},
      {name: '17', value: 17},
      {name: '18', value: 18},
      {name: '19', value: 19},
      {name: '20', value: 20},
      {name: '21', value: 21},
      {name: '22', value: 22},
      {name: '23', value: 23},
      {name: '24', value: 24},
      {name: '25', value: 25},
      {name: '26', value: 26},
      {name: '27', value: 27},
      {name: '28', value: 28},
      {name: '29', value: 29},
      {name: '30', value: 30},
      {name: '31', value: 31}
    ]

    if (month > 6) {
      value.splice(-1)
    }
    if (month == 12) {
      value.splice(-1);
    }

    return value;
  }
}
