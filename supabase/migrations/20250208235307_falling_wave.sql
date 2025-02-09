/*
  # Initial Schema Setup for Betting Control System

  1. New Tables
    - `bets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `date` (date)
      - `bookmaker` (text)
      - `description` (text)
      - `odd` (numeric)
      - `amount` (numeric)
      - `status` (enum: 'waiting', 'green', 'mafia')
      - `result` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `bets` table
    - Add policies for CRUD operations
*/

-- Create enum type for bet status
CREATE TYPE bet_status AS ENUM ('waiting', 'green', 'mafia', 'canceled');

-- Create bets table
CREATE TABLE IF NOT EXISTS bets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    date date NOT NULL DEFAULT CURRENT_DATE,
    bookmaker text NOT NULL,
    description text NOT NULL,
    odd numeric NOT NULL CHECK (odd > 0),
    amount numeric NOT NULL CHECK (amount > 0),
    status bet_status NOT NULL DEFAULT 'waiting',
    result numeric DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own bets"
    ON bets FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bets"
    ON bets FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bets"
    ON bets FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bets"
    ON bets FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
