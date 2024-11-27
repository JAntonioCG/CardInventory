<?php
require BASE_PATH . '/repositories/subexpansionsRepository.php';
require BASE_PATH . '/models/subexpansionsModel.php';

class subexpansionsController {
    private $subexpansionsRepository;

    public function __construct() {
        $this->subexpansionsRepository = new subexpansionsRepository();
    }

    public function obtenerSubexpansiones() {
        return $this->subexpansionsRepository->obtenerSubexpansiones(); // Devolverá un array de cartas
    }
    
    public function obtenerSubexpansionesPorExpansion($expansion_id) {
        return $this->subexpansionsRepository->obtenerSubexpansionesPorExpansion($expansion_id); // Devolverá un array de cartas
    }

    public function obtenerCartasPorSubexpansion($name) {
        return $this->subexpansionsRepository->obtenerCartasPorSubexpansion($name); // Devolverá un array de cartas
    }

    public function crearSubexpansion($name, $expansion_id) {
        return $this->subexpansionsRepository->crearSubexpansion($name, $expansion_id);
    }
}
