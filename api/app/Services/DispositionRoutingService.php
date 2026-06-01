<?php

namespace App\Services;

use App\Models\Organization;
use Illuminate\Support\Facades\Cache;

class DispositionRoutingService
{
    /**
     * Get the suggested routing path using Dijkstra's algorithm.
     *
     * @param int $sourceOrgId
     * @param int $targetLevel
     * @return array
     */
    public function suggestRoute(int $sourceOrgId, int $targetLevel): array
    {
        $graph = $this->buildGraph();

        // Dijkstra's algorithm
        $distances = [];
        $previous = [];
        $unvisited = [];

        foreach (array_keys($graph) as $nodeId) {
            $distances[$nodeId] = INF;
            $previous[$nodeId] = null;
            $unvisited[$nodeId] = true;
        }

        if (!isset($distances[$sourceOrgId])) {
            return []; // Source not found in graph
        }

        $distances[$sourceOrgId] = 0;

        while (!empty($unvisited)) {
            // Find node with minimum distance
            $minDistance = INF;
            $currentNode = null;
            foreach ($unvisited as $nodeId => $val) {
                if ($distances[$nodeId] < $minDistance) {
                    $minDistance = $distances[$nodeId];
                    $currentNode = $nodeId;
                }
            }

            if ($currentNode === null || $minDistance === INF) {
                break; // No reachable unvisited nodes left
            }

            unset($unvisited[$currentNode]);

            // Check if we reached a target node
            // Assuming target nodes are any node with the target level
            $org = Organization::find($currentNode);
            if ($org && $org->level === $targetLevel) {
                return $this->buildPath($previous, $currentNode);
            }

            // Update distances to neighbors
            foreach ($graph[$currentNode] as $neighborId => $weight) {
                if (!isset($unvisited[$neighborId])) {
                    continue;
                }

                $alt = $distances[$currentNode] + $weight;
                if ($alt < $distances[$neighborId]) {
                    $distances[$neighborId] = $alt;
                    $previous[$neighborId] = $currentNode;
                }
            }
        }

        return []; // Target level not reachable
    }

    /**
     * Reconstruct path from Dijkstra's previous array.
     */
    private function buildPath(array $previous, int $targetNode): array
    {
        $path = [];
        $currentNode = $targetNode;

        while ($currentNode !== null) {
            array_unshift($path, $currentNode);
            $currentNode = $previous[$currentNode];
        }

        return $path;
    }

    /**
     * Build the adjacency list representation of the organization hierarchy.
     */
    private function buildGraph(): array
    {
        return Cache::remember('org_routing_graph', 300, function () {
            $graph = [];
            $organizations = Organization::all();

            foreach ($organizations as $org) {
                if (!isset($graph[$org->id])) {
                    $graph[$org->id] = [];
                }

                if ($org->parent_id) {
                    // Bi-directional edge for parent-child relationship
                    $weight = $org->weight > 0 ? $org->weight : 1;
                    
                    if (!isset($graph[$org->parent_id])) {
                        $graph[$org->parent_id] = [];
                    }

                    $graph[$org->id][$org->parent_id] = $weight;
                    $graph[$org->parent_id][$org->id] = $weight;
                }
            }

            return $graph;
        });
    }
}
