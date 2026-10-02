-- Run once in the Supabase SQL Editor to add LKR 1,000 to every existing student wallet.
update public.wallet
set amount = amount + 1000
where amount > 0;
