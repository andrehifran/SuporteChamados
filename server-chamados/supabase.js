// supabase.js - Módulo de conexão com o banco de dados na nuvem
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Inicializa o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
