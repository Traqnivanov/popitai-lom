alter table public.questions
  add constraint questions_category_check
  check (category in (
    'Майстори и ремонти',
    'Здраве и лекари',
    'Автомобили',
    'Магазини и покупки',
    'Заведения',
    'Работа и услуги',
    'Обяви',
    'Събития и град'
  ));

alter table public.answers drop constraint if exists answers_body_check;
alter table public.answers
  add constraint answers_body_check
  check (char_length(body) between 3 and 5000);
