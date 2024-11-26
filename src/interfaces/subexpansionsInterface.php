<?php
interface ISubexpansions {
  public function obtenerSubexpansiones();
  public function obtenerCartasPorSubexpansion($name);
  public function crearSubexpansion($name, $expansion_id);
}